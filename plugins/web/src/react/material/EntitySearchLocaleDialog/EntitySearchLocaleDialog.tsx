import React from 'react';
import { noop } from '@amnis/state';
import type { Entity, Locale } from '@amnis/state';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { EntitySearchLocale } from '../EntitySearchLocale/index.js';

interface Props {
  open: boolean;
  onClose?: () => void;
  onSelect?: (entity: Entity<Locale>) => void;
}

export const EntitySearchLocaleDialog: React.FC<Props> = ({
  open = false,
  onClose = noop,
  onSelect = noop,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
  >
    <DialogContent>
      <Box sx={{ width: '100%', height: '80vh', overflow: 'hidden' }}>
        <EntitySearchLocale onSelect={onSelect} />
      </Box>
    </DialogContent>
    <DialogActions />
    <Button onClick={onClose}>Close</Button>
  </Dialog>
);

export default EntitySearchLocaleDialog;
