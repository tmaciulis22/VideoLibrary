import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  CardContent,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { confirmEmailDrawing } from '../../assets';

export default function ConfirmEmailCard() {
  return (
    <Paper elevation={3}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={confirmEmailDrawing}
          alt="Illustration of a mail with notification"
        />
        <Typography variant="h4" gutterBottom>
          Confirm registration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Typography>A link was sent to your email.</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Click it to confirm your registration</Typography>
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
