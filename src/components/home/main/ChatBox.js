import React from 'react';
import { Card, styled } from '@mui/material';
import PropTypes from 'prop-types';
import BoxInfoChatBox from './BoxInfoChatBox';
import BoxMessageChatBox from './BoxMessageChatBox';
import BoxOptionChatBox from './BoxOptionChatBox';

const RootStyle = styled(Card)(() => ({
  width: '350px',
  height: '450px',
  maxHeight: '600px',
  position: 'fixed',
  bottom: 0,
  right: 100,
  background: '#fff'
}));
ChatBox.prototype = {
  user: PropTypes.object,
  other: PropTypes.object
};
function ChatBox({ user, other }) {
  return (
    <RootStyle>
      <BoxInfoChatBox user={user} other={other} />
      <BoxMessageChatBox user={user} other={other} />
      <BoxOptionChatBox user={user} other={other} />
    </RootStyle>
  );
}

export default ChatBox;
