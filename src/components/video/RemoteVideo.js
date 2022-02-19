import { Card, styled } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CardVideo = styled(Card)(() => ({
  width: '40%'
}));
const Video = styled('video')(() => ({
  width: '80%',
  height: '400px'
}));
function RemoteVideo() {
  const remoteVideoRef = useRef();
  const remoteStream = useSelector((state) => state.call.remoteStream);
  const endCall = useSelector((state) => state.call.endCall);
  const navigate = useNavigate();
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
      console.log('remote');
      navigate('/home/app');
    }
  }, [endCall]);
  return (
    <CardVideo elevation={3} sx={{ background: '#fff' }}>
      <Video autoPlay ref={remoteVideoRef} />
    </CardVideo>
  );
}

export default RemoteVideo;
