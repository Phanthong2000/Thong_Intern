import React, { useEffect, useRef } from 'react';
import { Card, styled } from '@mui/material';
import { useSelector } from 'react-redux';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '200px',
  padding: theme.spacing(2),
  background: '#fff'
}));
const Video = styled('video')(() => ({
  width: '100%',
  height: '100%'
}));
function LocalVideo() {
  const myVideo = useRef();
  const localStreamGroup = useSelector((state) => state.call.localStreamGroup);
  useEffect(() => {
    if (localStreamGroup) {
      const localVideo = myVideo.current;
      localVideo.srcObject = localStreamGroup;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [localStreamGroup]);
  return (
    <RootStyle>
      <Video ref={myVideo} autoPlay />
    </RootStyle>
  );
}

export default LocalVideo;
