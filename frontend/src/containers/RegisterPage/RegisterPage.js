import { Grid } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router';
import { register } from '../../api/PublicAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGeneralError: false,
      showUserExistsError: false,
      isLoading: false,
    };
  }

  handleRegister = (firstName, lastName, email, password) => {
    this.setState({ isLoading: true });
    const data = {
      firstName,
      lastName,
      email,
      password,
    };
    register(data)
      .then(() => {
        this.setState({ isLoading: false });
        const { history } = this.props;
        history.push('/confirm-email');
      })
      .catch((ex) => {
        this.setState({ isLoading: false });
        if (ex.response === undefined) {
          this.setState({ showGeneralError: true });
          return;
        }
        const { status } = ex.response;
        if (status === 409) this.setState({ showUserExistsError: true });
        else this.setState({ showGeneralError: true });
      });
  };

  render() {
    const { showGeneralError, showUserExistsError, isLoading } = this.state;

    const hideGeneralError = () => {
      this.setState({ showGeneralError: false });
    };

    const hideUserExistsError = () => {
      this.setState({ showUserExistsError: false });
    };
    return (
      <>
        {showGeneralError && (
          <CustomSnackbar
            topCenter
            message="A server error has occurred. Please try again later"
            onClose={hideGeneralError}
            severity="error"
          />
        )}
        {showUserExistsError && (
          <CustomSnackbar
            topCenter
            message="User with this email already exists"
            onClose={hideUserExistsError}
            severity="error"
          />
        )}
        <Grid
          container
          className="root"
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={10} sm={6} md={4}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <RegistrationForm onRegister={this.handleRegister} />
            )}
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(RegisterPage);
