import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

const RootStyle = styled(Box)(() => ({
  display: 'block',
  textAlign: 'center'
}));
function EmptyPost() {
  return (
    <RootStyle>
      <Icon style={{ color: 'gray', width: '100px', height: '100px' }} icon="line-md:emoji-smile" />
      <Typography
        sx={{ fontWeight: 'bold', fontSize: '25px', color: 'gray', fontFamily: 'sans-serif' }}
      >
        Post empty
      </Typography>
    </RootStyle>
  );
}

export default EmptyPost;
