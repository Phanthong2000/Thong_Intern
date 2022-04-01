import React from 'react';
import { Card, styled } from '@mui/material';
import PropTypes from 'prop-types';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '300px',
  height: '350px',
  background: '#fff',
  padding: '10px'
}));
EmojiIconMessage.prototype = {
  user: PropTypes.object,
  choose: PropTypes.func
};
function EmojiIconMessage({ user, choose }) {
  return (
    <RootStyle>
      <Picker
        onEmojiClick={(event, emojiObject) => choose(emojiObject.emoji)}
        disableAutoFocus
        preload
        skinTone={SKIN_TONE_MEDIUM_DARK}
        groupNames={{ smileys_people: 'PEOPLE' }}
        native
      />
    </RootStyle>
  );
}

export default EmojiIconMessage;
