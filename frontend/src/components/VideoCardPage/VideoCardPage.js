import React from 'react';
import Grid from '@material-ui/core/Grid';
import TopBar from '../TopBar/TopBar';
import './styles.css';
import VideoCardsByDate from '../VideoCardsByDate/VideoCardsByDate';
import NavDrawer from '../NavDrawer/NavDrawer';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const VideoCardPage = ({
  renderSnackbars,
  title,
  size,
  showNavDrawer,
  videosInformation,
  showDeletionDialog,
  selectedCardIds,
  iconsToShow,
  iconsToShowOnSelected,
  handleIconsClick,
  handleIconsClickOnSelected,
  sortedVideoDates,
  handleSelect,
  handleDateSelect,
  showDownloadInProgress,
  handleActionIconClick,
  toggleNavDrawer,
  handleVideoDeletion,
  toggleDeletionDialog,
  deleteForever,
  children,
  isLoading,
  dateType,
}) => (
  <>
    {renderSnackbars()}
    <Grid
      className="root"
      style={{
        height: Object.keys(videosInformation).length === 0 ? '100vh' : 'auto',
      }}
      container
      direction="column"
    >
      <NavDrawer
        open={showNavDrawer}
        onOpen={toggleNavDrawer}
        onClose={toggleNavDrawer}
        spaceTaken={size}
      />
      <DeleteConfirmationDialog
        open={showDeletionDialog}
        onConfirm={handleVideoDeletion}
        onCancel={toggleDeletionDialog}
        multipleVideos={selectedCardIds.length > 1}
        deleteForever={deleteForever}
      />
      <Grid item>
        {selectedCardIds.length === 0 ? (
          <TopBar
            title={title}
            onActionIconClick={toggleNavDrawer}
            showAvatarAndLogout
            firstName={window.localStorage.getItem('firstName')}
            lastName={window.localStorage.getItem('lastName')}
            iconsToShow={iconsToShow}
            onIconsClick={handleIconsClick}
          />
        ) : (
          <TopBar
            title={`${selectedCardIds.length} ${
              selectedCardIds.length === 1 ? 'video' : 'videos'
            } selected`}
            showArrow
            iconsToShow={iconsToShowOnSelected}
            onIconsClick={handleIconsClickOnSelected}
            onActionIconClick={handleActionIconClick}
            disableIcons={showDownloadInProgress}
          />
        )}
      </Grid>
      {/* eslint-disable-next-line */}
      {isLoading ? (
        <LoadingSpinner />
      ) : Object.keys(videosInformation).length !== 0 ? (
        <Grid
          className="card_container"
          container
          item
          direction="column"
          spacing={5}
        >
          {sortedVideoDates.map((uploadDate) => (
            <VideoCardsByDate
              key={uploadDate}
              onSelect={handleSelect}
              videosInformation={videosInformation[uploadDate]}
              onSelectDate={handleDateSelect}
              selectedCardIds={selectedCardIds}
              dateType={dateType}
            />
          ))}
        </Grid>
      ) : (
        <Grid item container className="flex_grow">
          {children}
        </Grid>
      )}
    </Grid>
  </>
);

export default VideoCardPage;
