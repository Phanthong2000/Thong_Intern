import { Box, styled } from '@mui/material';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px'
}));
function Group() {
  useEffect(() => {
    document.title = 'Groups';
    return () => null;
  }, []);

  return (
    <RootStyle>
      <Outlet />
    </RootStyle>
  );
}

export default Group;
