import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  CardContent,
  IconButton,
  InputAdornment,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { visibilityIcon, visibilityOffIcon, productIcon } from '../../assets';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../constants';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState({
    errorEmail: false,
    errorPassword: false,
  });

  const handleLogin = (event) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setShowError({ ...showError, errorEmail: true });
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setShowError({ ...showError, errorPassword: true });
      return;
    }
    onLogin(email, password);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setShowError({ ...showError, errorEmail: false });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setShowError({ ...showError, errorPassword: false });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Paper elevation={3}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={productIcon}
          alt="Video library logo"
          width={50}
          height={50}
        />
        <Typography gutterBottom variant="h4">
          Login
        </Typography>
        <form noValidate onSubmit={handleLogin}>
          <Grid container spacing={1}>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    error={showError.errorEmail}
                    helperText={
                      showError.errorEmail ? 'Please enter a valid email' : ''
                    }
                    type="email"
                    id="email-field"
                    label="Email Address"
                    placeholder="email@domain.com"
                    variant="outlined"
                    fullWidth
                    onChange={handleEmailChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    error={showError.errorPassword}
                    helperText={
                      showError.errorPassword
                        ? 'Password must have at least 8 symbols with at least one capital letter and at least one number'
                        : ''
                    }
                    type={showPassword ? 'text' : 'password'}
                    id="password-field"
                    label="Password"
                    placeholder="**********"
                    variant="outlined"
                    fullWidth
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}>
                            {showPassword ? (
                              <img
                                src={visibilityOffIcon}
                                alt="Password visibility icon"
                                width={24}
                                height={24}
                              />
                            ) : (
                              <img
                                src={visibilityIcon}
                                alt="Password visibility off icon"
                                width={24}
                                height={24}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography align="left">
                <Link
                  component={RouterLink}
                  to="forgot-password"
                  variant="body2"
                >
                  Forgot your password?
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
