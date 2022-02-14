import React, { useEffect, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BoxUserChat from '../components/chat/BoxUserChat';
import BoxMessage from '../components/chat/BoxMessage';

const RootStyle = styled(Stack)(({ theme }) => ({
  marginTop: '60px',
  background: theme.palette.background,
  height: '100%'
}));
Chat.prototype = {
  user: PropTypes.object
};
function Chat({ user }) {
  useEffect(() => {
    document.title = 'Chat';
    return () => null;
  }, []);
  return (
    <RootStyle direction="row">
      <BoxUserChat user={user} />
      <BoxMessage user={user} />
    </RootStyle>
  );
}

export default Chat;
