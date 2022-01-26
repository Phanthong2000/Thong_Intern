import React, { useEffect } from 'react';
import { Box, styled } from '@mui/material';

const RootStyle = styled(Box)(({ theme }) => ({
  width: `calc(100% - 300px)`
}));
function Home() {
  useEffect(() => {
    window.document.title = 'Home';
  }, []);
  return <RootStyle style={{ background: '#000' }}>Home</RootStyle>;
}

export default Home;
