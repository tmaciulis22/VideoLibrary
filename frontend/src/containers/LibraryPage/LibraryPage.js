import React from 'react';
import SortIcon from '@material-ui/icons/Sort';
import fileDownload from 'js-file-download';
import SelectAllIcon from '../../assets/generic/SelectAllIcon';
import { DeleteIcon, DownloadIcon, UploadIcon } from '../../assets';
import './styles.css';
import {
  downloadVideos,
  getAllVideos,
  markForDeletion,
} from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import { getUserVideosSize } from '../../api/UserAPI';
import { normalizeCards, sortCardDates, transformCards } from '../../util/card';
import VideoCardPage from '../../components/VideoCardPage/VideoCardPage';
import EmptyLibraryContent from '../../components/EmptyLibraryContent/EmptyLibraryContent';
import UploadModal from '../../components/UploadModal/UploadModal';

class LibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videosInformation: {},
      size: 0,
      sortedVideoDates: [],
      selectedCardIds: [],
      showUploadModal: false,
      showNavDrawer: false,
      showDeletionDialog: false,
      showDeletionError: false,
      sortAscending: true,
      showDownloadError: false,
      showDownloadSuccess: false,
      showDownloadInProgress: false,
      showVideoRetrievalError: false,
      showDeletionSuccess: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true });
    const { sortAscending } = this.state;
    getAllVideos()
      .then((response) => {
        if (response.data.length !== 0) {
          const { transformedVideosInformation } = transformCards(
            response.data,
            'uploadDate',
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

  showUploadModal = () => 
    this.setState({ showUploadModal: true });

  hideUploadModal = (shouldFetchData) => {
    this.setState({ showUploadModal: false });
    if (shouldFetchData) this.fetchData();
  }

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  };

  handleVideoDeletion = () => {
    const { selectedCardIds, videosInformation, sortAscending } = this.state;
    markForDeletion(selectedCardIds)
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
          showDeletionSuccess: true,
        });
        this.toggleDeletionDialog();
      })
      .catch(() => this.setState({ showDeletionError: true }));
  };

  hideDeletionError = () => {
    this.setState({ showDeletionError: false });
    window.location.reload();
  };

  handleVideosDownload = () => {
    const { selectedCardIds } = this.state;
    this.setState({ showDownloadInProgress: true });
    downloadVideos(selectedCardIds)
      .then((response) => {
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition.split(';')[1].split('filename=')[1];
        fileDownload(response.data, filename);
        this.setState({
          showDownloadInProgress: false,
          showDownloadSuccess: true,
        });
      })
      .catch(() =>
        this.setState({
          showDownloadInProgress: false,
          showDownloadError: true,
        }),
      )
      .finally(() => this.setState({ selectedCardIds: [] }));
  };

  render() {
    const {
      showUploadModal,
      showNavDrawer,
      showDeletionDialog,
      videosInformation,
      showDeletionError,
      size,
      sortedVideoDates,
      selectedCardIds,
      showDownloadError,
      showDownloadInProgress,
      showDownloadSuccess,
      showVideoRetrievalError,
      showDeletionSuccess,
      isLoading,
    } = this.state;

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

    const renderSnackbars = () => {
      if (showDownloadError) {
        return (
          <CustomSnackbar
            message="Ooops.. Something wrong happened. Please try again later"
            onClose={() => this.setState({ showDownloadError: false })}
            severity="error"
          />
        );
      }
      if (showDownloadInProgress) {
        return (
          <CustomSnackbar
            message={
              selectedCardIds.length === 1
                ? 'Please wait. We are crunching your video'
                : 'Please wait. We are crunching the videos for you'
            }
            severity="info"
          />
        );
      }

      if (showDownloadSuccess) {
        return (
          <CustomSnackbar
            message={
              selectedCardIds.length === 1
                ? 'Video is ready to be downloaded'
                : 'Videos are ready to be downloaded'
            }
            onClose={() => this.setState({ showDownloadSuccess: false })}
            severity="success"
          />
        );
      }

      if (showDownloadError) {
        return (
          <CustomSnackbar
            message="Ooops.. Something wrong happened. Please try again later"
            onClose={() => this.setState({ showDownloadError: false })}
            severity="error"
          />
        );
      }

      if (showDeletionError) {
        return (
          <CustomSnackbar
            message="Could not delete your selection. Please try again later"
            onClose={() => this.setState({ showDeletionError: false })}
            severity="error"
          />
        );
      }

      if (showDeletionSuccess) {
        return (
          <CustomSnackbar
            message="Selection moved to recycling bin successfully"
            onClose={() => this.setState({ showDeletionSuccess: false })}
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

      return null;
    };

    return (
      <>
        <VideoCardPage
          renderSnackbars={renderSnackbars}
          title="Library"
          size={size}
          showNavDrawer={showNavDrawer}
          videosInformation={videosInformation}
          sortedVideoDates={sortedVideoDates}
          showDeletionDialog={showDeletionDialog}
          selectedCardIds={selectedCardIds}
          iconsToShow={[SelectAllIcon, SortIcon, UploadIcon]}
          handleIconsClick={[
            this.toggleSelectAll,
            this.toggleSort,
            this.showUploadModal,
          ]}
          iconsToShowOnSelected={[DownloadIcon, DeleteIcon]}
          handleIconsClickOnSelected={[
            this.handleVideosDownload,
            this.toggleDeletionDialog,
          ]}
          handleActionIconClick={() => this.setState({ selectedCardIds: [] })}
          handleDateSelect={handleDateSelect}
          handleSelect={handleSelect}
          showDownloadInProgress={showDownloadInProgress}
          toggleNavDrawer={this.toggleNavDrawer}
          handleVideoDeletion={this.handleVideoDeletion}
          toggleDeletionDialog={this.toggleDeletionDialog}
          isLoading={isLoading}
          dateType="uploadDate"
        >
          <EmptyLibraryContent />
        </VideoCardPage>
        <UploadModal show={showUploadModal} onClose={this.hideUploadModal} />
      </>
    );
  }
}

export default LibraryPage;
