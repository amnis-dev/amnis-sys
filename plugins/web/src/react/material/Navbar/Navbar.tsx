import React from 'react';
import type { Entity, Route } from '@amnis/state';
import { routeSlice } from '@amnis/state';

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
  Ider, iderEn, LanguageButton, AccountButton,
} from '@amnis/web/react/material';
import { Link } from '@amnis/web/lib/react-router-dom';
import { websiteSlice } from '@amnis/web/set';

import { useMenu, useTranslate, useWebSelector } from '@amnis/web/react/hooks';
import type { NavbarProps } from '@amnis/web/ui';

import { Text } from '../Text/index.js';

export const Navbar: React.FC<NavbarProps> = () => {
  const website = useTranslate(useWebSelector(websiteSlice.select.active));
  const routes = useTranslate(useWebSelector(routeSlice.select.entities));

  const { buttonProps, menuProps } = useMenu('navbar-mobile');

  const title = React.useMemo(() => website?.title, [website]);
  const routeTree = React.useMemo(() => {
    const r = website?.$routes ?? [];
    const tree = r.reduce<Entity<Route>[]>((acc, [$id, $parent]) => {
      if (!$parent && routes?.[$id]) {
        acc.push(routes[$id]);
      }
      return acc;
    }, []);
    return tree;
  }, [website, routes]);

  return (
    <AppBar position="static" color="inherit">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Ider
            entities={[
              iderEn(website, 'title'),
            ]}
          >
            <Box>
              <Text variant="h6" component="div">
                {title}
              </Text>
            </Box>
          </Ider>
          <Box sx={{ flexGrow: 1 }} />

          {/**
           * Mobile Display
           */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              {...buttonProps}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              {...menuProps}
            >
              {routeTree.map((route) => (
                <Ider
                  key={route.$id}
                  entities={[
                    iderEn(website, '$routes'),
                    iderEn(route, 'label'),
                  ]}
                >
                  <MenuItem>{route.label}</MenuItem>
                </Ider>
              ))}
            </Menu>
          </Box>

          {/**
           * Wide Display
           */}
          <Stack
            sx={{
              display: { xs: 'none', md: 'flex' },
            }}
            direction="row"
            gap={1}
          >
            <Box>
              {routeTree.map((route) => (
                <Link key={route.$id} to={route.path} style={{ textDecoration: 'none' }}>
                  <Ider
                    entities={[
                      iderEn(website, '$routes'),
                      iderEn(route, 'label'),
                    ]}
                  >
                    <Button sx={{ color: 'text.primary' }}>
                      <Text inherit>
                        {route.label}
                      </Text>
                    </Button>
                  </Ider>
                </Link>
              ))}
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <LanguageButton />
            </Box>
            <Box>
              <AccountButton />
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
