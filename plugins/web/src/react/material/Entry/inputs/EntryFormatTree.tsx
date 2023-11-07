import React from 'react';
import {
  FormControl,
  Box,
  List,
  ListItemButton,
  ListItem,
  Collapse,
  ListItemText,
} from '@mui/material';
import { dataName, stateSelect } from '@amnis/state';
import type { DataTree, Entity, UIDTree } from '@amnis/state';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { useTranslate, useWebSelector } from '@amnis/web/react/hooks';
import { Description, Label } from './parts/index.js';

const RecursiveList: React.FC<{ tree: DataTree<Entity> }> = ({ tree }) => {
  const [open, openSet] = React.useState(false);

  const treeRoots = React.useMemo(() => tree.map(([entity]) => entity), [tree]);
  const treeRootsTranslated = useTranslate(treeRoots)!;

  const treeTranslated = React.useMemo<DataTree<Entity>>(
    () => tree.map(
      ([, children], index) => ([treeRootsTranslated[index], children]),
    ),
    [treeRootsTranslated],
  );

  return tree.length ? (
    <List>
      {treeTranslated.map(([entity, children]) => (<React.Fragment key={entity.$id}>
        <ListItem
          button={children.length > 0}
          onClick={() => openSet(!open)}
        >
          <ListItemText primary={dataName(entity)} />
          <Box display={children.length > 0 ? undefined : 'none'}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </ListItem>
        {children.length > 0 ? (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box ml={1} pl={1} sx={{ borderLeft: 1 }}>
              <RecursiveList tree={children} />
            </Box>
          </Collapse>
        ) : null}
      </React.Fragment>))}
    </List>
  ) : null;
};

export const EntryFormatTree: React.FC = () => {
  const {
    value,
    entryId,
    errored,
    disabled,
    condensed,
  } = React.useContext(EntryContext) as EntryContextProps<UIDTree>;

  const tree = useWebSelector((state) => stateSelect.entityTree(state, value ?? []));

  const descriptionSx = React.useMemo(() => ({ m: 0 }), []);

  return (
    <FormControl
      id={entryId}
      error={errored}
      disabled={disabled}
      variant="outlined"
      size="small"
      fullWidth
    >
      <Box mb={condensed ? 0 : 0.5}>
        <Label type={condensed ? 'input' : 'form'} shrink={condensed} />
        <Description sx={descriptionSx} />
      </Box>
      <RecursiveList tree={tree} />
    </FormControl>
  );
};

export default EntryFormatTree;
