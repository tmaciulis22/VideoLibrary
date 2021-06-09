import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  CardContent,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { verifiedAccountDrawing } from '../../assets';

export default function VerifiedAccountCard() {
  return (
    <Paper elevation={3}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={verifiedAccountDrawing}
          alt="Illustration of a mail with notification"
        />
        <Typography variant="h4" gutterBottom>
          Email verified
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Typography>Your registration was confirmed.</Typography>
                <Typography>You are good to go!</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              component={RouterLink}
              to="/login"
            >
              Back to login
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
}
