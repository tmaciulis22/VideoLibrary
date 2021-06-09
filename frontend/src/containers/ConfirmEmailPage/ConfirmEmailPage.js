import React from 'react';
import { Grid } from '@material-ui/core';
import './styles.css';
import ConfirmEmailCard from '../../components/ConfirmEmailCard/ConfirmEmailCard';

class ConfirmEmailPage extends React.Component {
  render() {
    return (
      <Grid
        container
        className="root"
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item xs={10} sm={6} md={4} lg={3}>
          <ConfirmEmailCard />
        </Grid>
      </Grid>
    );
  }
}

export default ConfirmEmailPage;
