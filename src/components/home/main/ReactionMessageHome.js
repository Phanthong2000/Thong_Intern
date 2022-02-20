import React, { useState } from 'react';
import { Button, Card, Grid, styled } from '@mui/material';
import PropTypes from 'prop-types';
import StickerMessageHome from './StickerMessageHome';
import EmojiMessageHome from './EmojiMessageHome';
import TextMessageHome from './TextMessageHome';

const RootStyle = styled(Card)(() => ({
  width: '300px',
  height: '400px',
  background: '#fff'
}));
const BoxOptions = styled(Grid)(() => ({
  width: '100%',
  height: '50px'
}));
const ButtonOption = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  color: theme.palette.green,
  fontFamily: 'sans-serif',
  fontWeight: 'bold',
  fontSize: '15px'
}));
ReactionMessage.prototype = {
  user: PropTypes.object,
  close: PropTypes.func,
  chatbox: PropTypes.object,
  exists: PropTypes.bool,
  other: PropTypes.object
};
function ReactionMessage({ user, close, chatbox, exists, other }) {
  const [chooseOption, setChooseOption] = useState('sticker');
  const chooseSticker = () => {
    setChooseOption('sticker');
  };
  const chooseEmoji = () => {
    setChooseOption('emoji');
  };
  const chooseText = () => {
    setChooseOption('text');
  };
  return (
    <RootStyle>
      <BoxOptions container>
        <Grid xs={4} sm={4} md={4} lg={4} xl={4}>
          <ButtonOption
            onClick={chooseSticker}
            sx={{ borderBottom: chooseOption === 'sticker' ? `5px solid #30ab78` : `0px` }}
          >
            Sticker
          </ButtonOption>
        </Grid>
        <Grid xs={4} sm={4} md={4} lg={4} xl={4}>
          <ButtonOption
            onClick={chooseEmoji}
            sx={{ borderBottom: chooseOption === 'emoji' ? `5px solid #30ab78` : `0px` }}
          >
            Emoji
          </ButtonOption>
        </Grid>
        <Grid xs={4} sm={4} md={4} lg={4} xl={4}>
          <ButtonOption
            onClick={chooseText}
            sx={{ borderBottom: chooseOption === 'text' ? `5px solid #30ab78` : `0px` }}
          >
            Text
          </ButtonOption>
        </Grid>
      </BoxOptions>
      {chooseOption === 'sticker' && (
        <StickerMessageHome
          other={other}
          exists={exists}
          chatbox={chatbox}
          close={close}
          user={user}
        />
      )}
      {chooseOption === 'emoji' && (
        <EmojiMessageHome
          other={other}
          exists={exists}
          chatbox={chatbox}
          close={close}
          user={user}
        />
      )}
      {chooseOption === 'text' && (
        <TextMessageHome
          other={other}
          exists={exists}
          chatbox={chatbox}
          close={close}
          user={user}
        />
      )}
    </RootStyle>
  );
}

export default ReactionMessage;
