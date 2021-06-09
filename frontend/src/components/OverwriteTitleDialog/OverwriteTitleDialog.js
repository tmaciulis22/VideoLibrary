import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';

export default function OverwriteTitleDialog({
  open,
  onConfirm,
  onCancel,
  oldTitle,
  newTitle,
}) {
  return (
    <Dialog disableBackdropClick disableEscapeKeyDown maxWidth="xs" open={open}>
      <DialogTitle>The title has been changed recently</DialogTitle>
      <DialogContent>
        <Typography>
          Newest title is <b>{oldTitle}</b>
          <br />
          Do you want to overwrite it with <b>{newTitle}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} color="primary">
          No
        </Button>
        <Button onClick={onConfirm} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
