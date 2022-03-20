import { Icon } from '@iconify/react';
import { Box, Card, IconButton, styled } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CardVideo = styled(Card)(() => ({
  width: '40%'
}));
const Video = styled('video')(() => ({
  width: '100%',
  height: '400px'
}));
const IconSound = styled(Icon)(({ theme }) => ({
  width: '30px',
  height: '30px',
  color: theme.palette.green
}));
function RemoteVideo() {
  const remoteVideoRef = useRef();
  const remoteStream = useSelector((state) => state.call.remoteStream);
  const endCall = useSelector((state) => state.call.endCall);
  const navigate = useNavigate();
  const videoOther = useSelector((state) => state.call.videoOther);
  const audioOther = useSelector((state) => state.call.audioOther);
  useEffect(() => {
    if (remoteStream) {
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.srcObject = remoteStream;

      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    }
    console.log(remoteStream);
  }, [remoteStream]);
  useEffect(() => {
    if (endCall) {
      remoteVideoRef.current.srcObject = null;
      navigate('/home/app');
    }
  }, [endCall]);
  return (
    <CardVideo elevation={3} sx={{ background: '#fff' }}>
      <IconButton sx={{ width: '100%', textAlign: 'left' }} disabled>
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: '40px',
            height: '40px',
            borderRadius: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff'
          }}
        >
          {audioOther ? (
            <IconSound icon="akar-icons:sound-on" />
          ) : (
            <IconSound icon="akar-icons:sound-off" />
          )}
        </Box>
        <Video muted={!audioOther} hidden={!videoOther} autoPlay ref={remoteVideoRef} />
      </IconButton>
    </CardVideo>
  );
}

export default RemoteVideo;
