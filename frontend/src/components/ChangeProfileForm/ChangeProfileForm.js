import React, { useEffect, useState } from 'react';
import {
  Button,
  CardContent,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
} from '@material-ui/core';
import { visibilityIcon, visibilityOffIcon } from '../../assets';
import { EMAIL_REGEX, PASSWORD_REGEX, SUNFLOWER } from '../../constants';

export default function ChangeProfileForm({
  firstName,
  lastName,
  mail,
  onSaveChanges,
}) {
  const [email, setEmail] = useState(mail);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordHelperText, setNewPasswordHelperText] = useState('');
  const [showError, setShowError] = useState({
    errorEmail: false,
    errorPassword: false,
    errorNewPasswordMatch: false,
    errorNewPasswordRegex: false,
  });

  useEffect(() => {
    if (showError.errorNewPasswordMatch)
      setNewPasswordHelperText(
        'New password cannot be the same as the old password',
      );
    else if (showError.errorNewPasswordRegex)
      setNewPasswordHelperText(
        'Password must have at least 8 symbols with at least one capital letter and at least one number',
      );
    else setNewPasswordHelperText('');
  }, [showError]);

  const handleSaveChanges = (event) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setShowError({ ...showError, errorEmail: true });
      return;
    }
    if (password !== '' && newPassword !== '') {
      if (!PASSWORD_REGEX.test(password)) {
        setShowError({ ...showError, errorPassword: true });
        return;
      }
      if (!PASSWORD_REGEX.test(newPassword)) {
        setShowError({ ...showError, errorNewPasswordRegex: true });
        return;
      }
      if (newPassword === password) {
        setShowError({ ...showError, errorNewPasswordMatch: true });
        return;
      }
    }
    setNewPassword('');
    setPassword('');
    onSaveChanges(email, password, newPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setShowError({ ...showError, errorEmail: false });
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setShowError({
      ...showError,
      errorPassword: false,
      errorNewPasswordMatch: false,
    });
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    setShowError({
      ...showError,
      errorNewPasswordMatch: false,
      errorNewPasswordRegex: false,
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);

  return (
    <Paper elevation={3}>
      <CardContent>
        <Grid item xs={12}>
          <Grid
            style={{ marginBottom: 10 }}
            container
            spacing={3}
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Avatar style={{ backgroundColor: SUNFLOWER }}>
                {firstName[0] + lastName[0]}
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h6">{`${firstName} ${lastName}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <form noValidate onSubmit={handleSaveChanges}>
          <Grid item xs={12}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  required
                  value={email}
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
                  value={password}
                  required
                  error={showError.errorPassword}
                  helperText={
                    showError.errorPassword
                      ? 'Password must have at least 8 symbols with at least one capital letter and at least one number'
                      : ''
                  }
                  type={showPassword ? 'text' : 'password'}
                  id="password-field"
                  label="Old password"
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
              <Grid item xs={12}>
                <TextField
                  value={newPassword}
                  className="form__last-text-field"
                  required
                  error={
                    showError.errorNewPasswordMatch ||
                    showError.errorNewPasswordRegex
                  }
                  helperText={newPasswordHelperText}
                  type={showNewPassword ? 'text' : 'password'}
                  id="new-password-field"
                  label="New Password"
                  placeholder="**********"
                  variant="outlined"
                  fullWidth
                  onChange={handleNewPasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowNewPassword}>
                          {showNewPassword ? (
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
            <Grid container direction="row" justify="flex-end" spacing={3}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Save changes
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
