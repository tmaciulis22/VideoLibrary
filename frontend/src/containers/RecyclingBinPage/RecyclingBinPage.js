import React from 'react';
import SortIcon from '@material-ui/icons/Sort';
import SelectAllIcon from '../../assets/generic/SelectAllIcon';
import { DeleteForeverIcon } from '../../assets';
import './styles.css';
import {
  deleteVideos,
  getRecycledVideos,
  restoreVideos,
} from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import { getUserVideosSize } from '../../api/UserAPI';
import RestoreIcon from '../../assets/generic/RestoreIcon';
import { normalizeCards, sortCardDates, transformCards } from '../../util/card';
import VideoCardPage from '../../components/VideoCardPage/VideoCardPage';
import EmptyRecyclingBinContent from '../../components/EmptyRecyclingBinContent/EmptyRecyclingBinContent';

class RecyclingBinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videosInformation: {},
      size: 0,
      sortedVideoDates: [],
      sortAscending: true,
      selectedCardIds: [],
      showUploadModal: false,
      showNavDrawer: false,
      showDeletionDialog: false,
      showDeletionError: false,
      showDeletionSuccess: false,
      showVideoRetrievalError: false,
      showVideoRestorationError: false,
      showVideoRestorationSuccess: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    const { sortAscending } = this.state;
    getRecycledVideos()
      .then((response) => {
        if (response.data.length !== 0) {
          const { transformedVideosInformation } = transformCards(
            response.data,
            'deleteDate',
          );
          const sortedDates = sortCardDates(
            transformedVideosInformation,
            sortAscending,
          );
          this.setState({
            videosInformation: transformedVideosInformation,
            sortedVideoDates: sortedDates,
          });
        } else {
          this.setState({
            videosInformation: [],
          });
        }
      })
      .catch(() => {
        this.setState({ showVideoRetrievalError: true });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });

    getUserVideosSize()
      .then((response) => this.setState({ size: response.data }))
      .catch(() => {
        this.setState({ size: 0 });
      });
  }

  toggleSort = () => {
    const { sortAscending, videosInformation } = this.state;
    this.setState({
      sortAscending: !sortAscending,
      sortedVideoDates: sortCardDates(videosInformation, !sortAscending),
    });
  };

  toggleSelectAll = () => {
    const { videosInformation } = this.state;
    if (Object.values(videosInformation).length === 0) return;
    const allCards = Object.values(videosInformation)
      .reduce((acc, val) => acc.concat(val), [])
      .map((val) => val.id);
    this.setState({ selectedCardIds: allCards });
  };

  toggleNavDrawer = () => {
    const { showNavDrawer } = this.state;
    this.setState({ showNavDrawer: !showNavDrawer });
  };

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  };

  handleVideoDeletion = () => {
    const { selectedCardIds, videosInformation, sortAscending } = this.state;
    deleteVideos(selectedCardIds)
      .then(() => {
        const normalizedVideosInformation = normalizeCards(videosInformation);
        const newNormalizedVideosInformation = normalizedVideosInformation.filter(
          ({ id }) => !selectedCardIds.includes(id),
        );
        const { transformedVideosInformation } = transformCards(
          newNormalizedVideosInformation,
          'uploadDate',
        );
        const newSortedVideoCardDates = sortCardDates(
          transformedVideosInformation,
          sortAscending,
        );
        this.setState({
          videosInformation: transformedVideosInformation,
          sortedVideoDates: newSortedVideoCardDates,
          selectedCardIds: [],
          showDeletionSuccess: true,
        });
        this.toggleDeletionDialog();

        getUserVideosSize()
          .then((response) => this.setState({ size: response.data }))
          .catch(() => {
            this.setState({ size: 0 });
          });
      })
      .catch(() => this.setState({ showDeletionError: true }));
  };

  hideDeletionError = () => {
    this.setState({ showDeletionError: false });
    window.location.reload();
  };

  handleRestore = () => {
    const { selectedCardIds, videosInformation, sortAscending } = this.state;
    if (selectedCardIds.length === 0) return;
    restoreVideos(selectedCardIds)
      .then((response) => {
        let videoIds = response.data;
        const normalizedVideosInformation = normalizeCards(videosInformation);
        const newNormalizedVideosInformation = normalizedVideosInformation.filter(
          ({ id }) => {
            if (videoIds.includes(id)) {
              videoIds = videoIds.filter((videoId) => videoId !== id);
              return false;
            }
            return true;
          },
        );
        const { transformedVideosInformation } = transformCards(
          newNormalizedVideosInformation,
          'uploadDate',
        );
        const newSortedVideoCardDates = sortCardDates(
          transformedVideosInformation,
          sortAscending,
        );
        this.setState({
          videosInformation: transformedVideosInformation,
          sortedVideoDates: newSortedVideoCardDates,
          selectedCardIds: videoIds,
          showVideoRestorationSuccess: true,
        });
      })
      .catch(() => {
        this.setState({ showVideoRestorationError: true });
      });
  };

  render() {
    const {
      showUploadModal,
      showNavDrawer,
      showDeletionDialog,
      showDeletionError,
      videosInformation,
      size,
      sortedVideoDates,
      selectedCardIds,
      showVideoRetrievalError,
      showVideoRestorationError,
      showVideoRestorationSuccess,
      showDeletionSuccess,
      isLoading,
    } = this.state;

    const renderSnackbars = () => {
      if (showVideoRestorationError) {
        return (
          <CustomSnackbar
            message={`Failed to restore your ${
              selectedCardIds.length === 1 ? 'video' : 'videos'
            }. Please try again later`}
            onClose={() => this.setState({ showVideoRestorationError: false })}
            severity="error"
          />
        );
      }
      if (showVideoRestorationSuccess) {
        return (
          <CustomSnackbar
            message="Successfully restored your selection"
            onClose={() =>
              this.setState({ showVideoRestorationSuccess: false })
            }
            severity="success"
          />
        );
      }

      if (showVideoRetrievalError) {
        return (
          <CustomSnackbar
            message="There was an error retrieving your videos. Please try again later"
            onClose={() => this.setState({ showVideoRetrievalError: false })}
            severity="error"
          />
        );
      }

      if (showDeletionSuccess) {
        return (
          <CustomSnackbar
            message="Selection deleted forever successfully"
            onClose={() => this.setState({ showDeletionSuccess: false })}
            severity="success"
          />
        );
      }

      if (showDeletionError) {
        return (
          <CustomSnackbar
            message={`There was an error deleting your ${
              selectedCardIds.length === 1 ? 'video' : 'videos'
            }. Please try again later`}
            onClose={() => this.setState({ showVideoRetrievalError: false })}
            severity="error"
          />
        );
      }

      return null;
    };

    const handleSelect = (id) => {
      if (selectedCardIds.find((cardId) => cardId === id)) {
        const newSelectedCardIds = selectedCardIds.filter(
          (cardId) => cardId !== id,
        );
        this.setState({ selectedCardIds: newSelectedCardIds });
      } else {
        this.setState({ selectedCardIds: [...selectedCardIds, id] });
      }
    };

    const handleDateSelect = (ids) => {
      if (ids.every((id) => selectedCardIds.includes(id))) {
        const newSelectedCardIds = selectedCardIds.filter(
          (id) => !ids.includes(id),
        );
        this.setState({ selectedCardIds: newSelectedCardIds });
      } else {
        const newSelectedCardIds = selectedCardIds.slice();
        ids.forEach((id) => {
          if (!selectedCardIds.includes(id)) newSelectedCardIds.push(id);
        });
        this.setState({ selectedCardIds: newSelectedCardIds });
      }
    };

    return (
      <VideoCardPage
        renderSnackbars={renderSnackbars}
        title="Recycling bin"
        size={size}
        showNavDrawer={showNavDrawer}
        toggleNavDrawer={this.toggleNavDrawer}
        videosInformation={videosInformation}
        showUploadModal={showUploadModal}
        sortedVideoDates={sortedVideoDates}
        showDeletionDialog={showDeletionDialog}
        selectedCardIds={selectedCardIds}
        iconsToShow={[SelectAllIcon, SortIcon]}
        handleIconsClick={[this.toggleSelectAll, this.toggleSort]}
        iconsToShowOnSelected={[RestoreIcon, DeleteForeverIcon]}
        handleIconsClickOnSelected={[
          this.handleRestore,
          this.toggleDeletionDialog,
        ]}
        handleActionIconClick={() => this.setState({ selectedCardIds: [] })}
        handleVideoDeletion={this.handleVideoDeletion}
        toggleDeletionDialog={this.toggleDeletionDialog}
        handleSelect={handleSelect}
        handleDateSelect={handleDateSelect}
        deleteForever
        isLoading={isLoading}
        dateType="deleteDate"
      >
        <EmptyRecyclingBinContent />
      </VideoCardPage>
    );
  }
}

export default RecyclingBinPage;
