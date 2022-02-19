import React, { useContext } from 'react';
import { Grid, Typography, Paper, styled } from '@mui/material';

import { SocketContext } from '../../Context';

const VideoMe = styled('video')(({ theme }) => ({
  width: '550px',
  [theme.breakpoints.down('xs')]: {
    width: '300px'
  }
}));
const RootStyle = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column'
  }
}));
const PaperVideo = styled(Paper)(() => ({
  padding: '10px',
  border: '2px solid black',
  margin: '10px'
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  return (
    <RootStyle container>
      {stream && (
        <PaperVideo>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || 'Name'}
            </Typography>
            <VideoMe playsInline muted ref={myVideo} autoPlay />
          </Grid>
        </PaperVideo>
      )}
      {callAccepted && !callEnded && (
        <PaperVideo>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || 'Name'}
            </Typography>
            <video playsInline ref={userVideo} autoPlay>
              <track src="captions_es.vtt" kind="captions" label="spanish_captions" />
            </video>
          </Grid>
        </PaperVideo>
      )}
    </RootStyle>
  );
};

export default VideoPlayer;
