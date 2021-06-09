import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { forgotPasswordDrawing } from '../../assets';
import { EMAIL_REGEX } from '../../constants';

const ForgotPasswordCard = ({ onSend, requestInProgress }) => {
  const [showEmailError, setShowEmailError] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setShowEmailError(false);
  };

  const handleSendClick = (event) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setShowEmailError(true);
      return;
    }
    onSend(email);
  };

  return (
    <Paper elevation={3}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={forgotPasswordDrawing}
          alt="Illustration of a lock with a key inside"
        />
        <Typography variant="h4">Forgot password</Typography>
        <Typography style={{ marginBottom: 16 }}>
          Enter an email address and we will send you a reset password link
        </Typography>
        <form noValidate onSubmit={handleSendClick}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
              <TextField
                required
                value={email}
                error={showEmailError}
                helperText={showEmailError ? 'Please enter a valid email' : ''}
                type="email"
                id="email-field"
                label="Email Address"
                placeholder="email@domain.com"
                variant="outlined"
                fullWidth
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid
              container
              direction="row"
              wrap="nowrap"
              item
              spacing={2}
              justify="center"
            >
              <Grid xs={6} item>
                <Button
                  disabled={requestInProgress}
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                >
                  Send
                </Button>
              </Grid>
              <Grid xs={6} item>
                <Button
                  variant="outlined"
                  fullWidth
                  component={RouterLink}
                  to="/login"
                >
                  Back to login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
};

export default ForgotPasswordCard;
