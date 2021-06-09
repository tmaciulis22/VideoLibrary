import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { emptyRecyclingBinDrawing } from '../../assets';

export default function EmptyRecylingBinContent() {
  return (
    <Grid
      style={{ height: '100%', padding: '32px' }}
      container
      direction='column'
      align='center'
      justify='center'
    >
      <Grid item>
        <img height='100%' width='100%' src={emptyRecyclingBinDrawing} alt='A bin with a bunch of trash' />
      </Grid>
      <Grid item container direction='column'>
        <Typography align='center' variant='h3'>
          Recycling bin is empty
        </Typography>
      </Grid>
    </Grid>
  );
}
