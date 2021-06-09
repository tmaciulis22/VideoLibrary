import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

export default function DeleteConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  multipleVideos,
  deleteForever
}) {

  const getDialogText = () => {
    if (multipleVideos && deleteForever) {
      return "Are you sure you want to delete these videos forever?";
    } 
    if (multipleVideos && !deleteForever) {
      return "Are you sure you want to delete these videos? They will still be accessible in recycling bin";
    } 
    if (!multipleVideos && deleteForever) {
      return "Are you sure you want to delete this video forever?";
    } 
    return "Are you sure you want to delete this video? It will still be accessible in recycling bin";
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>Confirm deletion</DialogTitle>
      <DialogContent>
        {getDialogText()}
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
