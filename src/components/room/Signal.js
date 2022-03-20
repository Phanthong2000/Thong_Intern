import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, styled } from '@mui/material';
import Peer from 'simple-peer';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '300px',
  background: '#fff',
  textAlign: 'center',
  marginTop: '10px'
}));
const Video = styled('video')(({ theme }) => ({
  width: '100%',
  height: '100%'
}));
Signal.prototype = {
  signal: PropTypes.object
};
function Signal({ signal }) {
  const ref = useRef();
  useEffect(() => {
    const peer = new Peer({ initiator: false, trickle: false });
    peer.on('stream', (stream) => {
      console.log('ok', stream);
      // peer.addStream(stream);
      const remoteVideo = ref.current;
      remoteVideo.srcObject = stream;
      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    });
    peer.signal(signal);
    return () => null;
  }, []);
  return (
    <RootStyle>
      <Video autoPlay ref={ref} />
    </RootStyle>
  );
}

export default Signal;
