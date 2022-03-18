import React from 'react';
import { Card, styled } from '@mui/material';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  background: 'red',
  height: '600px'
}));
function RemoteVideo() {
  return <RootStyle>RemoteVideo</RootStyle>;
}

export default RemoteVideo;
