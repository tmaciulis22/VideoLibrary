import React from 'react';
import { Grid } from '@material-ui/core';
import './styles.css';
import { withRouter } from 'react-router';
import VerifiedAccountCard from '../../components/VerifiedAccountCard/VerifiedAccountCard';
import { verify } from '../../api/PublicAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';

class VerifyAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVerificationError: false,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const id = match.params.userId;
    verify(id).catch(() => this.setState({ showVerificationError: true }));
  }

  render() {
    const { showVerificationError } = this.state;

    const hideVerificationError = () => {
      this.setState({ showVerificationError: false });
    };

    return (
      <>
        {showVerificationError && (
          <CustomSnackbar
            topCenter
            message="Error has occured during verification"
            onClose={hideVerificationError}
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
          <Grid item xs={10} sm={6} md={4} lg={3}>
            <VerifiedAccountCard />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(VerifyAccountPage);
