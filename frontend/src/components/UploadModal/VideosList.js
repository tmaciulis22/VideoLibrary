import React from 'react';
import { List } from '@material-ui/core';
import VideoToUploadListItem from './VideoToUploadListItem';
import InUploadVideoListItem from './InUploadVideoListItem';
import UploadedVideoListItem from './UploadedVideoListItem';

export default function VideosList({
  videosToUploadNames,
  onRemoveVideoToUpload,
  inUploadVideoName,
  uploadProgress,
  onUploadCancel,
  uploadedVideos,
  videoTitles,
  onVideoTitleTextFieldChange,
  onVideoTitleChange,
  onVideoDeletion,
}) {
  const renderVideosToUploadListItems = () => {
    if (videosToUploadNames.length > 0) {
      return videosToUploadNames.map((name, index) => (
        <VideoToUploadListItem
          key={name + index.toString()}
          index={index}
          videoName={name}
          onRemoveVideoToUpload={onRemoveVideoToUpload(name)}
        />
      ));
    }
    return null;
  };

  const renderInUploadVideoListItem = () => {
    if (inUploadVideoName !== undefined) {
      return (
        <InUploadVideoListItem
          key={inUploadVideoName}
          videoName={inUploadVideoName}
          progress={uploadProgress}
          onUploadCancel={onUploadCancel}
        />
      );
    }
    return null;
  };

  const renderUploadedVideosListItems = () => {
    if (uploadedVideos.length > 0) {
      return uploadedVideos.map((video, index) => (
        <UploadedVideoListItem
          key={video.id}
          video={video}
          title={videoTitles[index]}
          onVideoTitleTextFieldChange={onVideoTitleTextFieldChange(video.id)}
          onVideoTitleChange={onVideoTitleChange(video.id)}
          onVideoDeletion={onVideoDeletion(video.id)}
        />
      ));
    }
    return null;
  };

  return (
    <List dense>
      {renderVideosToUploadListItems()}
      {renderInUploadVideoListItem()}
      {renderUploadedVideosListItems()}
    </List>
  );
}
