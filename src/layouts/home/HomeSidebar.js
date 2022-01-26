import React from 'react';
import { styled } from '@mui/material';

const RootStyle = styled('div')(({ theme }) => ({
  width: '300px'
}));
function HomeSidebar() {
  return <RootStyle>HomeSidebar</RootStyle>;
}

export default HomeSidebar;
