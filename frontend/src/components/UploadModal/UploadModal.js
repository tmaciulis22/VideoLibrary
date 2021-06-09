import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  Grid,
  Paper,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';
import { CancelToken, isCancel } from 'axios';
import {
  uploadChunk,
  finishUpload,
  deleteChunks,
  changeTitle,
  deleteVideos,
} from '../../api/VideoAPI';
import { getChunkCount } from '../../util';
import StyledDropzone from './StyledDropzone';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import { CHUNK_SIZE } from '../../constants';
import VideosList from './VideosList';
import './styles.css';

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value + 1);
}

export default function UploadModal({ show, onClose }) {
  const forceUpdate = useForceUpdate();

  const [videosToUpload, setVideosToUpload] = useState([]);
  const uploadedVideos = useRef([]); // Stores video entities from BE
  const videoTitles = useRef([]);

  const [isMultipleUpload, setIsMultipleUpload] = useState(false);
  const [areTitlesMissing, setAreTitlesMissing] = useState(false);

  const [inUploadVideo, setInUploadVideo] = useState(undefined);
  const totalChunkCount = useRef(undefined);
  const chunkIndex = useRef(1);
  const chunkStart = useRef(0);
  const chunkEnd = useRef(CHUNK_SIZE);
  const [progress, setProgress] = useState(0);

  const cancelTokenSource = useRef(undefined);

  const [showSnackbar, setShowSnackbar] = useState({
    onlyVideoFileTypesAccepted: false,
    noVideoAttached: false,
    uploadInProgress: false,
    videoTitleMissing: false,
    uploadError: false,
    serverError: false,
  });

  const handleAdd = (acceptedVideoFiles) => {
    if (acceptedVideoFiles.length > 1) {
      setIsMultipleUpload(true);
    }
    const nextVideo = acceptedVideoFiles.pop();
    setVideosToUpload([...acceptedVideoFiles]);
    setInUploadVideo(nextVideo);
  };

  const handleReject = () =>
    setShowSnackbar({ ...showSnackbar, onlyVideoFileTypesAccepted: true });

  const handleClose = (shouldFetchData) => {
    setVideosToUpload([]);
    uploadedVideos.current = [];
    setIsMultipleUpload(false);
    setAreTitlesMissing(false);
    setInUploadVideo(undefined);
    totalChunkCount.current = undefined;
    chunkIndex.current = 1;
    chunkStart.current = 0;
    chunkEnd.current = CHUNK_SIZE;
    setProgress(0);
    cancelTokenSource.current = undefined;
    setShowSnackbar({
      onlyVideoFileTypesAccepted: false,
      noVideoAttached: false,
      uploadInProgress: false,
      videoTitleMissing: false,
      uploadError: false,
      serverError: false,
    });
    onClose(shouldFetchData);
  };

  const handleCancel = () => {
    if (cancelTokenSource.current !== undefined) {
      cancelTokenSource.current.cancel();
    }
    const requests = [];
    if (inUploadVideo !== undefined) {
      requests.push(deleteChunks(inUploadVideo.name));
    }
    if (uploadedVideos.current.length > 0) {
      const videoIds = uploadedVideos.current.map((video) => video.id);
      requests.push(deleteVideos(videoIds));
    }
    if (requests.length > 0) {
      Promise.all(requests)
        .then(() => handleClose())
        .catch(() => handleClose());
    } else {
      handleClose();
    }
  };

  const handleSubmit = () => {
    if (
      videosToUpload.length === 0 &&
      uploadedVideos.current.length === 0 &&
      inUploadVideo === undefined
    ) {
      setShowSnackbar({ ...showSnackbar, noVideoAttached: true });
    } else if (inUploadVideo !== undefined || videosToUpload.length > 0) {
      setShowSnackbar({ ...showSnackbar, uploadInProgress: true });
    } else if (areTitlesMissing) {
      setShowSnackbar({ ...showSnackbar, videoTitleMissing: true });
    } else {
      handleClose(true);
    }
  };

  const resetUploadState = () => {
    totalChunkCount.current = undefined;
    chunkIndex.current = 1;
    chunkStart.current = 0;
    chunkEnd.current = CHUNK_SIZE;
    if (videosToUpload.length > 0) {
      const videosToUploadCopy = videosToUpload.slice();
      const nextVideo = videosToUploadCopy.pop();
      setVideosToUpload([...videosToUploadCopy]);
      setInUploadVideo(nextVideo);
    } else {
      setInUploadVideo(undefined);
    }
  };

  const handleUploadInterruption = (requestCancelled) => {
    if (!requestCancelled) {
      setShowSnackbar({ ...showSnackbar, uploadError: true });
      deleteChunks(inUploadVideo.name)
        .then(() => resetUploadState())
        .catch(() => resetUploadState());
    }
  };

  const finishVideoUpload = () => {
    cancelTokenSource.current = CancelToken.source();
    finishUpload(inUploadVideo.name, cancelTokenSource.current)
      .then((response) => {
        setProgress(100);
        uploadedVideos.current = [response.data, ...uploadedVideos.current];
        videoTitles.current = [response.data.title, ...videoTitles.current];
        resetUploadState();
      })
      .catch((error) => handleUploadInterruption(isCancel(error)));
  };

  const uploadNextChunk = (chunk) => {
    cancelTokenSource.current = CancelToken.source();
    uploadChunk(
      chunkIndex.current,
      inUploadVideo.name,
      chunk,
      cancelTokenSource.current,
    )
      .then(() => {
        if (chunkIndex.current >= totalChunkCount.current) {
          finishVideoUpload();
        } else {
          chunkStart.current = chunkEnd.current;
          chunkEnd.current += CHUNK_SIZE;
          const percentage =
            (chunkIndex.current / totalChunkCount.current) * 100;
          chunkIndex.current += 1;
          setProgress(percentage);
        }
      })
      .catch((error) => handleUploadInterruption(isCancel(error)));
  };

  useEffect(() => {
    if (inUploadVideo !== undefined) {
      totalChunkCount.current = getChunkCount(inUploadVideo);
      setProgress(1);
    }
  }, [inUploadVideo]);

  useEffect(() => {
    if (
      chunkIndex.current <= totalChunkCount.current &&
      inUploadVideo !== undefined &&
      progress !== 100
    ) {
      const chunk = inUploadVideo.slice(chunkStart.current, chunkEnd.current);
      uploadNextChunk(chunk);
    }
  }, [progress]);

  const handleRemoveVideoToUpload = (videoName) => () => {
    const index = videosToUpload.findIndex((video) => video.name === videoName);
    const videosToUploadCopy = videosToUpload.slice();
    videosToUploadCopy.splice(index, 1);
    setVideosToUpload([...videosToUploadCopy]);
  };

  const handleUploadCancel = () => {
    if (cancelTokenSource.current !== undefined && chunkIndex.current < totalChunkCount.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
      deleteChunks(inUploadVideo.name)
        .then(() => resetUploadState())
        .catch(() => resetUploadState());
    }
  };

  const handleVideoTitleChange = (videoId) => (newTitle) => {
    if (newTitle === '') {
      setAreTitlesMissing(true);
      return;
    }
    const index = uploadedVideos.current.findIndex(
      (video) => video.id === videoId,
    );
    const { rowVersion } = uploadedVideos.current[index];
    changeTitle(videoId, newTitle, rowVersion)
      .then((response) => {
        const uploadedVideosCopy = uploadedVideos.current.slice();
        uploadedVideosCopy.splice(index, 1, response.data);
        uploadedVideos.current = [...uploadedVideosCopy];
        setAreTitlesMissing(false);
        forceUpdate();
      })
      .catch(() => setShowSnackbar({ ...showSnackbar, serverError: false }));
  };

  const handleVideoTitleTextFieldChange = (videoId) => (newTitle) => {
    const index = uploadedVideos.current.findIndex(
      (video) => video.id === videoId,
    );
    const videoTitleCopy = videoTitles.current.slice();
    videoTitleCopy.splice(index, 1, newTitle);
    videoTitles.current = [...videoTitleCopy];
    forceUpdate();
  }

  const handleVideoDeletion = (videoId) => () =>
    deleteVideos([videoId])
      .then(() => {
        uploadedVideos.current = [
          ...uploadedVideos.current.filter((video) => video.id !== videoId),
        ];
        forceUpdate();
      })
      .catch(() => setShowSnackbar({ ...showSnackbar, serverError: true }));

  const renderSnackbars = () => {
    if (showSnackbar.onlyVideoFileTypesAccepted) {
      return (
        <CustomSnackbar
          message="Only video file types are accepted"
          onClose={() =>
            setShowSnackbar({
              ...showSnackbar,
              onlyVideoFileTypesAccepted: false,
            })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.uploadError) {
      return (
        <CustomSnackbar
          message="Something wrong happened :/ Video was not uploaded"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, uploadError: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.serverError) {
      return (
        <CustomSnackbar
          message="Oops... Something wrong happened :/"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, serverError: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.videoTitleMissing) {
      return (
        <CustomSnackbar
          message="Please enter a title for each uploaded video"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, videoTitleMissing: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.noVideoAttached) {
      return (
        <CustomSnackbar
          message="Please attach a video before submitting"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, noVideoAttached: false })
          }
          severity="info"
        />
      );
    }
    if (showSnackbar.uploadInProgress) {
      return (
        <CustomSnackbar
          message="Please wait until your video(-s) will be uploaded"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, uploadInProgress: false })
          }
          severity="info"
        />
      );
    }

    return null;
  };

  const shouldRenderDropzone = () =>
    videosToUpload.length === 0 &&
    inUploadVideo === undefined &&
    uploadedVideos.current.length === 0;

  const renderModalTitle = () => {
    let title = null;
    if (videosToUpload.length > 0 || inUploadVideo) {
      title = isMultipleUpload
        ? 'Your videos are being uploaded...'
        : 'Your video is being uploaded...';
    } else if (
      uploadedVideos.current.length > 0 &&
      videosToUpload.length === 0
    ) {
      title = isMultipleUpload
        ? 'Your videos have been successfully uploaded'
        : 'Your video has been successfully uploaded';
    }
    if (title !== null) {
      return (
        <Grid item xs={12}>
          <Typography className="modal__title" variant="subtitle1">
            {title}
          </Typography>
        </Grid>
      );
    }
    return null;
  };

  return (
    <>
      {renderSnackbars()}
      <Modal
        className="modal"
        open={show}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableBackdropClick
      >
        <Fade in={show}>
          <Paper className="modal__paper">
            <CardContent>
              <Grid container direction="column" spacing={2}>
                {shouldRenderDropzone() && (
                  <Grid item xs={12}>
                    <StyledDropzone onAdd={handleAdd} onReject={handleReject} />
                  </Grid>
                )}
                {renderModalTitle()}
                {!shouldRenderDropzone() && (
                  <VideosList
                    videosToUploadNames={videosToUpload.map(
                      (video) => video.name,
                    )}
                    onRemoveVideoToUpload={handleRemoveVideoToUpload}
                    inUploadVideoName={
                      inUploadVideo ? inUploadVideo.name : undefined
                    }
                    uploadProgress={progress}
                    onUploadCancel={handleUploadCancel}
                    uploadedVideos={uploadedVideos.current}
                    videoTitles={videoTitles.current}
                    onVideoTitleTextFieldChange={handleVideoTitleTextFieldChange}
                    onVideoTitleChange={handleVideoTitleChange}
                    onVideoDeletion={handleVideoDeletion}
                  />
                )}
                <Grid item container spacing={1} justify="flex-end">
                  <Grid item>
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}
