import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material';

const VideoOther = styled('video')(({ theme }) => ({
  width: '100%',
  height: '100%'
}));
function Video(props) {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <VideoOther style={{ width: '50px', height: '50px' }} playsInline autoPlay ref={ref} />;
}

export default Video;
