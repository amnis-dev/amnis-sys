import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import { Text } from '../Text/index.js';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * A dialog component that displays a confirmation message with two buttons: Confirm and Cancel.
 * @param open - A boolean that determines whether the dialog is open or closed.
 * @param onClose - A function that is called when the dialog is closed.
 * @param onConfirm - A function that is called when the Confirm button is clicked.
 * @param title - The title of the dialog.
 * @param message - The message to be displayed in the dialog.
 * @param confirmText - The text to be displayed on the Confirm button. Default is 'Confirm'.
 * @param cancelText - The text to be displayed on the Cancel button. Default is 'Cancel'.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle component="div">
      <Text variant="h2" fontSize="inherit" fontFamily="inherit" fontWeight="inherit">
        {title}
      </Text>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <Text variant="body1" fontSize="inherit" fontFamily="inherit" fontWeight="inherit">
          {message}
        </Text>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{cancelText}</Button>
      <Button onClick={onConfirm} autoFocus>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
