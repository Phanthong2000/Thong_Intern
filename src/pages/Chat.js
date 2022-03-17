import React, { useEffect, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import BoxUserChat from '../components/chat/BoxUserChat';
import BoxMessage from '../components/chat/BoxMessage';
import BoxInfoUserChat from '../components/chat/BoxInfoUserChat';
import OptionsMessage from '../components/chat/OptionsMessage';
import Snack from '../components/Snack';
import BoxImageMessage from '../components/chat/BoxImageMessage';
import BoxFileMessage from '../components/chat/BoxFileMessage';
import BoxInfoChatgroup from '../components/chat/BoxInfoChatgroup';
import BoxMessageChatgroup from '../components/chat/BoxMessageChatgroup';
import OptionsMessageChatgroup from '../components/chat/OptionsMessageChatgroup';
import BoxOptionsChatbox from '../components/chat/BoxOptionsChatbox';
import BoxReply from '../components/chat/BoxReply';
import { actionChatReplyMessage } from '../redux/actions/chatAction';

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
  const chatbox = useSelector((state) => state.chat.chatbox);
  const optionsChatbox = useSelector((state) => state.chat.optionsChatbox);
  const reply = useSelector((state) => state.chat.reply);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = 'Chat';
    return () => {
      dispatch(actionChatReplyMessage({}));
    };
  }, [user]);
  return (
    <RootStyle direction="row">
      <BoxUserChat user={user} />
      <Stack sx={{ width: '100%', marginRight: '20px' }}>
        <BoxFileMessage />
        {chatbox.type === 'group' ? (
          <BoxInfoChatgroup user={user} />
        ) : (
          <BoxInfoUserChat user={user} />
        )}
        {chatbox.type === 'group' ? (
          <BoxMessageChatgroup user={user} />
        ) : (
          <BoxMessage user={user} />
        )}
        {imageMessages.length !== 0 && <BoxImageMessage user={user} />}
        {reply.id !== undefined && <BoxReply user={user} />}
        {chatbox.type === 'group' ? (
          <OptionsMessageChatgroup user={user} />
        ) : (
          <OptionsMessage user={user} />
        )}
      </Stack>
      {optionsChatbox && chatbox.type === 'group' && <BoxOptionsChatbox user={user} />}
      <Snack />
    </RootStyle>
  );
}

export default Chat;
