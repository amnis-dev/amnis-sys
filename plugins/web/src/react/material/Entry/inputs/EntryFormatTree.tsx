import React from 'react';
import {
  FormControl,
  Box,
  List,
  ListItem,
  Collapse,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import { dataName, stateSelect } from '@amnis/state';
import type {
  DataTree, Entity, SchemaTypeArray, UID, UIDTree,
} from '@amnis/state';
import {
  DragIndicator, Edit, ExpandLess, ExpandMore,
} from '@mui/icons-material';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext, useDroppable, closestCorners, useDraggable, useDndMonitor,
} from '@dnd-kit/core';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { useTranslate, useWebSelector } from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';
import { Description, Label } from './parts/index.js';

const RecursiveDroppableParts: React.FC<{ entityId: UID }> = ({
  entityId,
}) => {
  const [render, renderSet] = React.useState(false);

  useDndMonitor({
    onDragStart: (event) => {
      if (event.active.id !== entityId) {
        renderSet(true);
      }
    },
    onDragEnd: () => {
      renderSet(false);
    },
  });

  const {
    setNodeRef: setNodeRefAbove,
    isOver: isOverAbove,
  } = useDroppable({
    id: `above-${entityId}`,
  });

  const {
    setNodeRef: setNodeRefMiddle,
    isOver: isOverMiddle,
  } = useDroppable({
    id: `middle-${entityId}`,
  });

  const {
    setNodeRef: setNodeRefBelow,
    isOver: isOverBelow,
  } = useDroppable({
    id: `below-${entityId}`,
  });

  const sharedSx = React.useMemo(() => ({
    boxSizing: 'border-box',
    position: 'absolute',
    width: '100%',
  }), []);

  return render ? (
    <Box sx={{
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
    }}>
      <Box
        ref={setNodeRefAbove}
        sx={{
          ...sharedSx,
          top: -4,
          left: 0,
          height: '32%',
          borderTopWidth: 8,
          borderTopColor: 'primary.main',
          borderTopStyle: isOverAbove ? 'solid' : 'none',
        }}
      ></Box>
      <Box
        ref={setNodeRefMiddle}
        sx={{
          ...sharedSx,
          top: 0,
          height: '100%',
          opacity: 0.5,
          bgcolor: isOverMiddle ? 'primary.main' : undefined,
        }}
      ></Box>
      <Box
        ref={setNodeRefBelow}
        sx={{
          ...sharedSx,
          bottom: -4,
          height: '32%',
          borderBottomWidth: 8,
          borderBottomColor: 'primary.main',
          borderBottomStyle: isOverBelow ? 'solid' : 'none',
        }}
      ></Box>
    </Box>) : null;
};

const RecursiveListItem: React.FC<{
  entity: Entity;
  tree: DataTree<Entity>;
  children: React.ReactNode;
}> = ({
  entity,
  tree,
  children,
}) => {
  const [open, openSet] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: entity.$id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const handleOpen = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openSet(!open);
  }, [open]);

  const handleEdit = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  return (<>
    <Box position="relative">
      <ListItem
        ref={setNodeRef}
        style={style}
        {...attributes}
        sx={{ position: 'relative' }}
        button={true}
        onClick={handleOpen}
      >
        <ListItemIcon
          ref={setActivatorNodeRef}
          sx={{ cursor: 'grab' }}
          {...listeners}
        >
          <DragIndicator />
        </ListItemIcon>
        <Box flex={1}>
          <Text>{dataName(entity)}</Text>
        </Box>
        <Box>
          <IconButton
            onClick={handleOpen}
            sx={{ visibility: tree.length > 0 ? undefined : 'hidden' }}
            aria-hidden={tree.length > 0 ? undefined : true}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Box>
          <IconButton
            onClick={handleEdit}
          >
            <Edit />
          </IconButton>
        </Box>
      </ListItem>

      <RecursiveDroppableParts entityId={entity.$id} />
    </Box>
    {tree.length > 0 ? (
      <Collapse
        in={open && !isDragging}
        timeout="auto"
        sx={{ ml: 3, borderLeft: 1 }}
        unmountOnExit
      >
        {children}
      </Collapse>
    ) : null}
  </>);
};

const RecursiveList: React.FC<{
  tree: DataTree<Entity>;
}> = ({
  tree,
}) => {
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
      {treeTranslated.map(([entity, children]) => (
        <RecursiveListItem key={entity.$id} entity={entity} tree={children}>
          <RecursiveList tree={children} />
        </RecursiveListItem>
      ))}
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
    items,
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<UIDTree>;

  const sliceKey = React.useMemo(() => {
    const itemSchema = items as SchemaTypeArray;
    if (Array.isArray(itemSchema.items)) {
      return itemSchema.items[0].pattern?.match(/([A-Za-z0-9]+):/)?.[1] as string | undefined;
    }
    return undefined;
  }, [items]);

  React.useEffect(() => {
    console.log({ sliceKey });
  }, [sliceKey]);

  const uidTree = React.useMemo(() => value ?? [], [value]);
  const tree = useWebSelector((state) => stateSelect.entityTree(state, uidTree));
  const descriptionSx = React.useMemo(() => ({ m: 0 }), []);

  const boxHeight = React.useMemo(
    () => (tree.length < 6 ? tree.length * 64 + 128 : 512),
    [tree.length],
  );

  const handleDragEnd = React.useCallback(({ active, over }: DragEndEvent) => {
    if (!active || !over) {
      return;
    }

    const activeId = active.id as UID;
    const [overPosition, ...overRemaining] = (over.id as string).split('-');
    const overId = overRemaining.join('-') as UID;

    if (!overPosition || !overId) {
      console.error('Could not parse over ID on drop end event.');
      return;
    }

    if (activeId === overId) {
      return;
    }

    // console.log({ activeId, overId, overPosition });

    const referenceNext = [...uidTree.filter(([entityId]) => entityId !== activeId)];
    const overIndex = referenceNext.findIndex(([entityId]) => entityId === overId);
    if (overIndex === -1) {
      return;
    }
    const overParentId = referenceNext[overIndex][1];
    // console.log({
    //   uidTree, overIndex, overId, overParentId,
    // });

    if (activeId === overParentId) {
      return;
    }

    if (overPosition === 'above') {
      referenceNext.splice(overIndex, 0, [activeId, overParentId]);
    } else if (overPosition === 'middle') {
      referenceNext.splice(overIndex + 1, 0, [activeId, overId]);
    } else if (overPosition === 'below') {
      referenceNext.splice(overIndex + 1, 0, [activeId, overParentId]);
    }

    onChange(referenceNext);
  }, [uidTree]);

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
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <Box
          sx={{
            borderColor: 'divider',
            borderWidth: 1,
            borderStyle: 'solid',
            overflowX: 'hidden',
            height: boxHeight,
          }}
        >
          <RecursiveList tree={tree} />
        </Box>
      </DndContext>
    </FormControl>
  );
};

export default EntryFormatTree;
