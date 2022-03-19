import React, { useEffect, useRef } from 'react';
import { Box, Card, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  background: '#fff',
  height: '300px'
}));
const Video = styled('video')(() => ({
  width: '100%',
  height: '100%'
}));
RemoteVideo.prototype = {
  remote: PropTypes.object,
  index: PropTypes.number
};
function RemoteVideo({ remote, index }) {
  const remoteStreamGroup = useSelector((state) => state.call.remoteStreamGroup);
  const remoteVideoRef = useRef();
  useEffect(() => {
    if (remote) {
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.srcObject = remote;

      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    }
  }, [remoteStreamGroup]);
  if (remote === undefined) return null;
  return (
    <RootStyle>
      <Video autoPlay ref={remoteVideoRef} />
    </RootStyle>
  );
}

export default RemoteVideo;
