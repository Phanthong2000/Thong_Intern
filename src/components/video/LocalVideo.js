import { Card, styled } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const CardVideo = styled(Card)(() => ({
  width: '40%'
}));
const Video = styled('video')(() => ({
  width: '80%',
  height: '400px'
}));
function LocalVideo() {
  const myVideo = useRef();
  const stream = useSelector((state) => state.call.stream);
  const endCall = useSelector((state) => state.call.endCall);
  useEffect(() => {
    if (stream) {
      const localVideo = myVideo.current;
      localVideo.srcObject = stream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [stream]);
  useEffect(() => {
    if (endCall) {
      myVideo.current.srcObject = null;
      console.log('local');
    }
  }, [endCall]);
  return (
    <CardVideo elevation={3} sx={{ background: '#fff' }}>
      <Video autoPlay ref={myVideo} />
    </CardVideo>
  );
}

export default LocalVideo;
