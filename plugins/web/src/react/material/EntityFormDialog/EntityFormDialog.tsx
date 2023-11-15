import React from 'react';
import { noop, type UID } from '@amnis/state';
import {
  Box,
  Button, Dialog, DialogActions, DialogContent,
} from '@mui/material';
import { EntityForm } from '../EntityForm/index.js';

interface Props {
  open: boolean;
  $id?: string | UID;
  onClose?: () => void;
}

export const EntityFormDialog: React.FC<Props> = ({
  open = false,
  $id,
  onClose = noop,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
  >
    <DialogContent>
      <Box sx={{ width: '100%' }}>
        <EntityForm $id={$id} />
      </Box>
    </DialogContent>
    <DialogActions />
    <Button onClick={onClose}>Close</Button>
  </Dialog>
);

export default EntityFormDialog;
