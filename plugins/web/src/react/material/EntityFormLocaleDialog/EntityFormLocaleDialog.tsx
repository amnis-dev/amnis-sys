import React from 'react';
import { localeSlice, noop } from '@amnis/state';
import type { UID } from '@amnis/state';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { useCrudRead, useWebSelector } from '@amnis/web/react/hooks';
import { EntityFormLocale } from '../EntityFormLocale/index.js';

interface Props {
  open: boolean;
  $id?: UID | string;
  name?: string;
  onClose?: () => void;
}

export const EntityFormLocaleDialog: React.FC<Props> = ({
  open = false,
  $id: $idProp,
  name,
  onClose = noop,
}) => {
  const { crudRead } = useCrudRead();

  const locale = useWebSelector(
    (state) => (name ? localeSlice.select.byName(state, name) : undefined),
  );

  const $id = React.useMemo<UID | undefined>(
    () => $idProp as UID ?? locale?.$id,
    [$idProp, locale?.$id],
  );

  React.useEffect(() => {
    if (!open || !!locale) return;

    crudRead({
      [localeSlice.key]: {
        $query: {
          name: {
            $eq: name,
          },
        },
      },
    });
  }, [open, locale, name]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        zIndex: 2200,
      }}
    >
      <DialogContent>
        <Box sx={{ width: '100%', height: '80vh', overflow: 'hidden' }}>
          <EntityFormLocale $id={$id} />
        </Box>
      </DialogContent>
      <DialogActions />
      <Button onClick={onClose}>Close</Button>
    </Dialog>
  );
};

export default EntityFormLocaleDialog;
