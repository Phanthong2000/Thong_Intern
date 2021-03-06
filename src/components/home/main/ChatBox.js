import React from 'react';
import { Card, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import BoxInfoChatBox from './BoxInfoChatBox';
import BoxMessageChatBox from './BoxMessageChatBox';
import BoxOptionChatBox from './BoxOptionChatBox';
import BoxReply from '../../chat/BoxReply';

const RootStyle = styled(Card)(() => ({
  width: '350px',
  height: '550px',
  maxHeight: '600px',
  position: 'fixed',
  bottom: 0,
  right: 100,
  background: '#fff',
  zIndex: 999
}));
ChatBox.prototype = {
  user: PropTypes.object,
  other: PropTypes.object,
  chatbox: PropTypes.object
};
function ChatBox({ user, other, chatbox }) {
  const newChatbox = useSelector((state) => state.chat.newChatbox);
  const reply = useSelector((state) => state.chat.reply);
  return (
    <RootStyle sx={{ right: newChatbox ? 500 : 100 }}>
      <BoxInfoChatBox user={user} other={other} chatbox={chatbox} />
      <BoxMessageChatBox user={user} chatbox={chatbox} other={other} />
      {reply.id !== undefined && <BoxReply user={user} />}
      <BoxOptionChatBox user={user} chatgroup={chatbox} other={other} />
    </RootStyle>
  );
}

export default ChatBox;
