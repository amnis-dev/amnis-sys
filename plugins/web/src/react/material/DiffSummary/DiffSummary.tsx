import type { UID } from '@amnis/state';
import {
  UIDNominal, dataActions, dataName, stateSelect,
} from '@amnis/state';
import React from 'react';
import {
  Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Tooltip,
} from '@mui/material';
import { Add, Restore, Update } from '@mui/icons-material';
import {
  useLocale, useTranslate, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';
import { ConfirmDialog } from '../ConfirmDialog/index.js';

type DiffSummaryRestoreType = 'c' | 'u' | 'd';

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
  const created = useWebSelector(stateSelect.stagedCreate);
  const updated = useWebSelector(stateSelect.stagedUpdate);
  const stateEntityDifferences = useWebSelector(stateSelect.entityDifferences);

  const localeKeys = React.useRef(['!diff.restore'] as const);
  const locale = useLocale(localeKeys.current);

  const [confirmState, confirmStateSet] = React.useState({
    open: false,
    entityId: '',
    type: undefined as DiffSummaryRestoreType | undefined,
  });

  const createdTranslated = useTranslate(created)!;
  const updatedTranslated = useTranslate(updated)!;

  const updatedDiffCount = React.useMemo<Record<UID, number>>(() => {
    const diffCounts: Record<UID, number> = {
      [UIDNominal._]: 0,
    };
    stateEntityDifferences.forEach((diff) => {
      diffCounts[diff.current!.$id] = diff.keys.length;
    });
    return diffCounts;
  }, [updated]);

  const handleConfirmClose = React.useCallback(() => {
    confirmStateSet({
      open: false,
      entityId: '',
      type: undefined,
    });
  }, []);

  const handleConfirmConfirm = React.useCallback(() => {
    /**
     * Confirm restore create.
     */
    if (confirmState.type === 'c') {
      const sliceKey = confirmState.entityId.split(':')[0];
      dispatch(dataActions.delete({
        [sliceKey]: [confirmState.entityId as UID],
      }));
    }

    /**
     * Confirm restore update.
     */
    if (confirmState.type === 'u') {
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
    }

    handleConfirmClose();
  }, [dispatch, handleConfirmClose, confirmState.entityId]);

  const handleRestore = React.useCallback(
    (entityId: string | UID, type: DiffSummaryRestoreType) => {
      confirmStateSet({
        open: true,
        entityId,
        type,
      });
    },
    [dispatch, stateEntityDifferences],
  );

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

  const RestoreButton = React.useMemo<React.FC<{ $id: string | UID, type: DiffSummaryRestoreType}>>(
    () => (({ $id, type }) => (
      <Tooltip title={locale['!diff.restore']}>
        <IconButton onClick={() => handleRestore($id, type)}>
          <Restore />
        </IconButton>
      </Tooltip>
    )),
    [locale],
  );

  return (<>
    <List>
      {createdTranslated.map((entity) => (
        <ListItem
          key={entity.$id}
          disablePadding={!!onClick}
          secondaryAction={(<RestoreButton $id={entity.$id} type="c" />)}
        >
          <ListButton onClick={() => onClick && onClick(entity.$id)}>
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: 'green' }}>
                <Add />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={dataName(entity)}
              secondary={(<Stack direction="row">
                <span>
                  {`${entity.$id.split(':')[0]}`}
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>{new Date(entity.updated).toLocaleString()}</span>
              </Stack>)}
            />
          </ListButton>
        </ListItem>
      ))}
      {updatedTranslated.map((entity) => (
        <ListItem
          key={entity.$id}
          disablePadding={!!onClick}
          secondaryAction={<RestoreButton $id={entity.$id} type="u" />}
        >
          <ListButton onClick={() => onClick && onClick(entity.$id)}>
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: 'yellow' }}>
                <Update />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={dataName(entity)}
              secondary={(<Stack direction="row">
                <span>
                  {`${entity.$id.split(':')[0]} (${updatedDiffCount[entity.$id]})`}
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
