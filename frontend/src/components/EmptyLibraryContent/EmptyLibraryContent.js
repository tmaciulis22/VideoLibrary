import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { emptyLibraryDrawing } from '../../assets';

export default function EmptyLibraryContent() {
  return (
    <Grid
      style={{ height: '100%', padding: '32px' }}
      container
      direction='column'
      align='center'
      justify='center'
    >
      <Grid item>
        <img height='100%' width='100%' src={emptyLibraryDrawing} alt='Two friendly people standing' />
      </Grid>
      <Grid item container direction='column'>
        <Typography align='center' variant='h3'>
          It feels empty here...
        </Typography>
        <Typography align='center' variant='h5'>
          Upload a video by clicking the upload icon on the top
        </Typography>
      </Grid>
    </Grid>
  );
}
