import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  CardMedia,
  Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './styles.css';
import { missingImageIcon } from '../../assets';
import { getVideoThumbnail } from '../../api/VideoAPI';

const VideoCard = ({ title, onSelect, id, isSelected }) => {
  const [thumbnail, setThumbnail] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    getVideoThumbnail(id)
      .then((response) => setThumbnail(URL.createObjectURL(response.data)))
      .catch(() => setThumbnail(missingImageIcon));
  }, []);

  const handleClick = () => {
    history.push(`/player/${id}`);
  };

  return (
    <Card
      className="card"
      variant="outlined"
      style={{ border: `${isSelected ? '0.5px solid blue' : ''}` }}
    >
      <CardHeader
        classes={{
          content: 'card_content',
        }}
        disableTypography
        title={
          <Typography noWrap gutterBottom variant="h6">
            {title}
          </Typography>
        }
        action={
          <Grid item>
            <IconButton onClick={() => onSelect(id)}>
              <CheckCircleIcon color={isSelected ? 'primary' : 'inherit'} />
            </IconButton>
          </Grid>
        }
      />
      <CardMedia
        onClick={handleClick}
        component="img"
        className="card_image"
        src={thumbnail}
      />
    </Card>
  );
};

export default VideoCard;
