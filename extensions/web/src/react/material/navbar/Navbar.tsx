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
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import type { NavbarProps } from '../../../interface/index.js';
import { useTranslate, useWebSelector } from '../../hooks/index.js';
import { websiteSlice } from '../../../set/index.js';
import { Ider, iderEn } from '../../Ider.js';
import { LanguageButton } from '../language-button/index.js';

export const Navbar: React.FC<NavbarProps> = ({
  titleHide,
  routesHide,
}) => {
  const website = useTranslate(useWebSelector(websiteSlice.select.active));
  const routes = useTranslate(useWebSelector(routeSlice.select.entities));

  const refMenuButton = React.useRef<HTMLButtonElement>(null);

  const title = React.useMemo(() => website?.title, [website]);
  const routeTree = React.useMemo(() => {
    const r = website?.$routes ?? [];
    const tree = r.reduce<Entity<Route>[]>((acc, [$id, $parent]) => {
      if (!$parent && routes[$id]) {
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
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            </Box>
          </Ider>
          <Box sx={{ flexGrow: 1 }} />

          {/**
           * Mobile Display
           */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              ref={refMenuButton}
              size="large"
              edge="start"
              color="inherit"
              aria-label="navigation menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="navbar-menu"
              anchorEl={refMenuButton.current}
              open={false}
              onClose={() => {}}
              MenuListProps={{
                'aria-labelledby': 'navbar-menu',
              }}
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
          <Stack sx={{ display: { xs: 'none', md: 'flex' } }} direction="row" gap={1}>
            <Box>
              {routeTree.map((route) => (
                <Ider
                  key={route.$id}
                  entities={[
                    iderEn(website, '$routes'),
                    iderEn(route, 'label'),
                  ]}
                >
                  <Button sx={{ color: 'text.primary' }}>{route.label}</Button>
                </Ider>
              ))}
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <LanguageButton />
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
