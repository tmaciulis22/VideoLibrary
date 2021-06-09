import React from 'react';
import { IconButton, Divider, Grid, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VideoCard from '../VideoCard/VideoCard';
import './styles.css';

const VideoCardsByDate = ({
  videosInformation,
  onSelect,
  selectedCardIds,
  onSelectDate,
  dateType,
}) => (
  <Grid container item direction="column">
    <Grid item container alignItems="center">
      <Grid item>
        <IconButton onClick={() => onSelectDate(videosInformation.map((card) => card.id))}>
          <CheckCircleIcon color={videosInformation
            .map((card) => card.id)
            .every((id) => selectedCardIds.includes(id)) ? 'primary' : 'inherit'} />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography variant="h6">{videosInformation[0][dateType]}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
    <Grid container item direction="row" spacing={5} style={{ marginTop: 0 }}>
      {videosInformation.map(({ title, id }) => (
        <Grid item className="card_grid" key={id}>
          <VideoCard
            id={id}
            title={title}
            onSelect={onSelect}
            isSelected={
              selectedCardIds
                ? selectedCardIds.find((cardId) => cardId === id)
                : false
            }
          />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

export default VideoCardsByDate;
