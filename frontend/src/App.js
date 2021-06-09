import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

import LoginPage from './containers/LoginPage/LoginPage';
import RegisterPage from './containers/RegisterPage/RegisterPage';
import ConfirmEmailPage from './containers/ConfirmEmailPage/ConfirmEmailPage';
import LibraryPage from './containers/LibraryPage/LibraryPage';
import RecyclingBinPage from './containers/RecyclingBinPage/RecyclingBinPage';
import ProfilePage from './containers/ProfilePage/ProfilePage';
import ForgotPasswordPage from './containers/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './containers/ResetPasswordPage/ResetPasswordPage';
import VerifyAccountPage from './containers/VerifyAccountPage/VerifyAccountPage';
import PlayerPage from './containers/PlayerPage/PlayerPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      {!window.localStorage.getItem('token') ? (
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPasswordPage />
          </Route>
          <Route exact path="/reset-password/:token">
            <ResetPasswordPage />
          </Route>
          <Route exact path="/confirm-email">
            <ConfirmEmailPage />
          </Route>
          <Route path="/verify/:userId">
            <VerifyAccountPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route path="*">
            <Redirect to="/">
              <LoginPage />
            </Redirect>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/bin">
            <RecyclingBinPage />
          </Route>
          <Route exact path="/profile">
            <ProfilePage />
          </Route>
          <Route exact path="/library">
            <LibraryPage />
          </Route>
          <Route path="/player/:videoId">
            <PlayerPage />
          </Route>
          <Route path="*">
            <Redirect to="/library">
              <LibraryPage />
            </Redirect>
          </Route>
        </Switch>
      )}
    </Router>
  );
}

export default App;
