import React from 'react';
import { useHistory } from 'react-router';
import {
  AppBar,
  Avatar,
  Button,
  Grid,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ArrowBackIcon, MenuIcon, productIcon } from '../../assets';
import { GRAY_1, GRAY_5, GRAY_6, SUNFLOWER } from '../../constants';

export default function TopBar({
  darkMode,
  showArrow,
  onActionIconClick, // For arrow back or navigation drawer icons
  title,
  iconsToShow = [], // Array of Icon Components(like in DownloadIcon.js). These icons will be shown on right side of TopBar
  onIconsClick = [], // Array of on click callbacks for each icon in iconsToShow. NOTE: order of callbacks must match order of icons
  showAvatarAndLogout,
  firstName,
  lastName,
  disableIcons,
}) {
  const history = useHistory();
  const backgroundColor = darkMode ? GRAY_1 : GRAY_6;
  const iconFillColor = darkMode ? GRAY_5 : GRAY_1;
  const fontColor = darkMode ? GRAY_5 : GRAY_1;

  const onLogout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  const renderIcons = () =>
    iconsToShow.map((Icon, index) => (
      <Grid item key={index.toString()}>
        <IconButton
          onClick={onIconsClick[index]}
          edge="end"
          disabled={disableIcons}
        >
          <Icon fill={iconFillColor} />
        </IconButton>
      </Grid>
    ));

  return (
    <>
      <AppBar
        style={{ background: backgroundColor }}
        position="fixed"
        elevation={1}
      >
        <Toolbar>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <IconButton edge="start" onClick={onActionIconClick}>
                {showArrow ? (
                  <ArrowBackIcon fill={iconFillColor} />
                ) : (
                  <MenuIcon fill={iconFillColor} />
                )}
              </IconButton>
            </Grid>
            {!showArrow && (
              <Grid item>
                <IconButton
                  edge="start"
                  onClick={() => history.push('/library')}
                >
                  <img
                    src={productIcon}
                    alt="Product icon"
                    width={36}
                    height={36}
                  />
                </IconButton>
              </Grid>
            )}
            <Hidden xsDown>
              <Grid item>
                <Typography style={{ color: fontColor }} variant="h6">
                  {title}
                </Typography>
              </Grid>
            </Hidden>
            <Grid
              item
              xs
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              {renderIcons()}
            </Grid>
            {showAvatarAndLogout && (
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <IconButton
                      edge="end"
                      onClick={() =>
                        history.push('/profile', {
                          url: window.location.pathname,
                        })
                      }
                    >
                      <Avatar style={{ backgroundColor: SUNFLOWER }}>
                        {firstName[0] + lastName[0]}
                      </Avatar>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={onLogout}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
