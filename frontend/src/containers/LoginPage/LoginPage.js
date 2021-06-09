import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import LoginForm from '../../components/LoginForm/LoginForm';
import { authenticate, getCurrentUser } from '../../api/PublicAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import { videoTimeDrawing } from '../../assets';
import './styles.css';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showWrongCredentialsError: false,
      showGeneralError: false,
    };
  }

  handleLogin = (mail, password) => {
    authenticate(mail, password)
      .then((responseToken) => {
        const token = responseToken.data;
        getCurrentUser(token)
          .then((responseUserData) => {
            const { id, firstName, lastName, email } = responseUserData.data;
            window.localStorage.setItem('token', token);
            localStorage.setItem('id', id);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('email', email);
            window.location.reload();
          })
          .catch(() => {
            this.setState({ showGeneralError: true });
            window.localStorage.clear();
          });
      })
      .catch((ex) => {
        if (ex.response === undefined) {
          this.setState({ showGeneralError: true });
          return;
        }
        const { status } = ex.response;
        if (status === 404) this.setState({ showWrongCredentialsError: true });
        else this.setState({ showGeneralError: true });
      });
  };

  render() {
    const { showGeneralError, showWrongCredentialsError } = this.state;

    const hideGeneralError = () => {
      this.setState({ showGeneralError: false });
    };

    const hideWrongCredentialsError = () => {
      this.setState({ showWrongCredentialsError: false });
    };

    return (
      <>
        {showGeneralError && (
          <CustomSnackbar
            topCenter
            message="A server error has occurred"
            onClose={hideGeneralError}
            severity="error"
          />
        )}
        {showWrongCredentialsError && (
          <CustomSnackbar
            topCenter
            message="Email or password is not correct"
            onClose={hideWrongCredentialsError}
            severity="error"
          />
        )}
        <Grid
          container
          className="root"
          justify="space-evenly"
          direction="row"
          alignItems="center"
        >
          <Hidden smDown>
            <Grid item>
              <img
                src={videoTimeDrawing}
                alt="Two people looking at their smart devices in front of a video screen"
              />
            </Grid>
          </Hidden>
          <Grid item xs={10} sm={6} md={3}>
            <LoginForm onLogin={this.handleLogin} />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default LoginPage;
