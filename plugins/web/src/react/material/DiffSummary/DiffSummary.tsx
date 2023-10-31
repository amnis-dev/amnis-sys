import type { Entity, UID } from '@amnis/state';
import { dataActions, dataName, stateSelect } from '@amnis/state';
import React from 'react';
import {
  Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Tooltip,
} from '@mui/material';
import { Restore, Update } from '@mui/icons-material';
import {
  useLocale, useTranslate, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';
import { ConfirmDialog } from '../ConfirmDialog/index.js';

export interface DiffSummaryProps {
  /**
   * Click event.
   */
  onClick?: ($id: UID) => void;
}

export const DiffSummary: React.FC<DiffSummaryProps> = ({
  onClick,
}) => {
  const dispatch = useWebDispatch();
  const stateEntityDifferences = useWebSelector(stateSelect.entityDifferences);

  const localeKeys = React.useRef(['!diff.restore'] as const);
  const locale = useLocale(localeKeys);

  const [confirmState, confirmStateSet] = React.useState({
    open: false,
    entityId: '',
  });

  const entitiesChanged = React.useMemo<(
  Entity & {changeCount: number })[]>(
    () => stateEntityDifferences
      .map((diff) => ({ ...diff.current, changeCount: diff.keys.length }))
      .filter((entity) => !!entity) as (Entity & {changeCount: number })[],
    [stateEntityDifferences],
    );

  const entitiesTranslated = useTranslate(entitiesChanged)!;

  const handleConfirmClose = React.useCallback(() => {
    confirmStateSet({
      open: false,
      entityId: '',
    });
  }, []);

  const handleConfirmConfirm = React.useCallback(() => {
    const entityDiff = stateEntityDifferences.find(
      (diff) => diff.current?.$id === confirmState.entityId,
    );
    if (!entityDiff || !entityDiff.original) return;

    dispatch(dataActions.update({
      [entityDiff.sliceKey]: [
        {
          ...entityDiff.original,
          $id: confirmState.entityId as UID,
        },
      ],
    }));
    handleConfirmClose();
  }, [dispatch, handleConfirmClose, confirmState.entityId]);

  const handleRestore = React.useCallback((entityId: string | UID) => {
    confirmStateSet({
      open: true,
      entityId,
    });
  }, [dispatch, stateEntityDifferences]);

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

  const RestoreButton = React.useMemo((): React.FC<{ $id: string | UID }> => ({ $id }) => (
    <Tooltip title={locale['!diff.restore']}>
      <IconButton onClick={() => handleRestore($id)}>
        <Restore />
      </IconButton>
    </Tooltip>
  ), [locale]);

  return (<>
    <List>
      {entitiesTranslated.map((entity) => (
        <ListItem
          key={entity.$id}
          disablePadding={!!onClick}
          secondaryAction={<RestoreButton $id={entity.$id} />}
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
    <ConfirmDialog
      open={confirmState.open}
      onClose={handleConfirmClose}
      onConfirm={handleConfirmConfirm}
      title={'Please Confirm'}
      message={'Are you sure you want to restore this data? This action cannot be undone.'}
    />
  </>
  );
};

export default DiffSummary;
