import React, { useEffect, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import BoxUserChat from '../components/chat/BoxUserChat';
import BoxMessage from '../components/chat/BoxMessage';
import BoxInfoUserChat from '../components/chat/BoxInfoUserChat';
import OptionsMessage from '../components/chat/OptionsMessage';
import Snack from '../components/Snack';
import BoxImageMessage from '../components/chat/BoxImageMessage';
import BoxFileMessage from '../components/chat/BoxFileMessage';

const heightScreen = window.screen.height;
const RootStyle = styled(Stack)(({ theme }) => ({
  marginTop: '60px',
  background: theme.palette.background,
  height: `calc(${heightScreen}px - 180px)`
}));
Chat.prototype = {
  user: PropTypes.object
};
function Chat({ user }) {
  const imageMessages = useSelector((state) => state.chat.imageMessages);
  useEffect(() => {
    document.title = 'Chat';
    return () => null;
  }, [user]);
  return (
    <RootStyle direction="row">
      <BoxUserChat user={user} />
      <Stack sx={{ width: '100%', marginRight: '20px' }}>
        <BoxInfoUserChat user={user} />
        <BoxFileMessage />
        <BoxMessage user={user} />
        {imageMessages.length !== 0 ? <BoxImageMessage user={user} /> : null}
        <OptionsMessage user={user} />
      </Stack>
      <Snack />
    </RootStyle>
  );
}

export default Chat;
