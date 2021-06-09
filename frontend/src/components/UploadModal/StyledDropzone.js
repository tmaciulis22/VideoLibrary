import { Grid, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

export default function StyledDropzone({ onAdd, onReject }) {
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDropAccepted: onAdd,
    onDropRejected: onReject,
    accept: 'video/*'
  });

  const className = useMemo(() => {
    let name = 'modal__dropzone';
    if (isDragAccept) {
      name += ' modal__dropzone--accept';
    }
    if (isDragReject) {
      name += ' modal__dropzone--reject';
    }

    return name;
  }, [isDragAccept, isDragReject]);

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Grid container {...getRootProps({ className })}>
        <Grid item xs={12}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <input {...getInputProps()} />
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6">
            Drag and drop a video here or click to select it
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <CloudUploadIcon fontSize="large" />
        </Grid>
      </Grid>
    </>
  );
}
