import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab/';

/* eslint-disable react/jsx-props-no-spreading */
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomSnackbar = ({
  topCenter,
  message,
  severity,
  onClose,
  duration,
}) => (
  <Snackbar
    open
    anchorOrigin={
      topCenter
        ? { vertical: 'top', horizontal: 'center' }
        : { vertical: 'bottom', horizontal: 'left' }
    }
    autoHideDuration={duration || 3000}
    onClose={onClose}
  >
    <Alert severity={severity || 'success'}>
      {message || 'Message with no provided text'}
    </Alert>
  </Snackbar>
);

export default CustomSnackbar;
