import type { Entity, UID } from '@amnis/state';
import { dataName, stateSelect } from '@amnis/state';
import React from 'react';
import {
  Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack,
} from '@mui/material';
import { Restore, Update } from '@mui/icons-material';
import { useTranslate, useWebSelector } from '@amnis/web/react/hooks';

export interface DiffSummaryProps {
  /**
   * Click event.
   */
  onClick?: ($id: UID) => void;
}

export const DiffSummary: React.FC<DiffSummaryProps> = ({
  onClick,
}) => {
  const stateEntityDifferences = useWebSelector(stateSelect.entityDifferences);

  const entitiesChanged = React.useMemo<(
  Entity & {changeCount: number })[]>(
    () => stateEntityDifferences
      .map((diff) => ({ ...diff.current, changeCount: diff.keys.length }))
      .filter((entity) => !!entity) as (Entity & {changeCount: number })[],
    [stateEntityDifferences],
    );

  const entitiesTranslated = useTranslate(entitiesChanged)!;

  const ListButton = React.useMemo<
  React.FC<{ children: React.ReactNode, onClick: DiffSummaryProps['onClick'] }>
  >(() => {
    if (!onClick) return ({ children }) => <>{children}</>;
    return ({ children, onClick: onClickInner }) => (
      <ListItemButton onClick={onClickInner}>
        {children}
      </ListItemButton>
    );
  }, [onClick]);

  return (
    <List>
      {entitiesTranslated.map((entity) => (
        <ListItem
          key={entity.$id}
          disablePadding={!!onClick}
          secondaryAction={(
            <IconButton>
              <Restore />
            </IconButton>
          )}
        >
          <ListButton onClick={() => onClick && onClick(entity.$id)}>
            <ListItemAvatar>
              <Avatar>
                <Update />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={dataName(entity)}
              secondary={(<Stack direction="row">
                <span>
                  {`${entity.$id.split(':')[0]} (${entity.changeCount})`}
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>{new Date(entity.updated).toLocaleString()}</span>
              </Stack>)}
            />
          </ListButton>
        </ListItem>
      ))}
    </List>
  );
};

export default DiffSummary;
