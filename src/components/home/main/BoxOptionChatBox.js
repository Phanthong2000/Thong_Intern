import React from 'react';
import { Box, Card, InputBase, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  height: '60px',
  padding: '5px',
  display: 'flex',
  alignItems: 'center'
}));
const IconButtonOption = styled(Box)(({ theme }) => ({
  width: '30px',
  height: '30px',
  borderRadius: '30px',
  marginLeft: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    background: 'lightgrey'
  }
}));
const IconOption = styled(Icon)(({ theme }) => ({
  width: '20px',
  height: '20px',
  color: theme.palette.green
}));
const BoxInput = styled(Box)(({ theme }) => ({
  width: '70%',
  marginLeft: '10px',
  background: theme.palette.background,
  borderRadius: '30px',
  padding: `0px 20px`,
  display: 'flex',
  alignItems: 'center'
}));
const InputMessage = styled(InputBase)(() => ({
  width: '100%',
  display: 'flex',
  maxHeight: '100px'
}));
BoxOptionChatBox.prototype = {
  user: PropTypes.object
};
function BoxOptionChatBox({ user }) {
  return (
    <RootStyle>
      <IconButtonOption>
        <IconOption icon="bxs:plus-circle" />
      </IconButtonOption>
      <IconButtonOption>
        <IconOption icon="gridicons:image-multiple" />
      </IconButtonOption>
      <IconButtonOption>
        <IconOption icon="fluent:sticker-24-filled" />
      </IconButtonOption>
      <IconButtonOption>
        <IconOption icon="mdi:file-gif-box" />
      </IconButtonOption>
      <BoxInput>
        <Scrollbar alwaysShowTracks>
          <InputMessage multiline autoFocus placeholder="Aa" />
        </Scrollbar>
        <IconButtonOption>
          <IconOption icon="carbon:face-satisfied-filled" />
        </IconButtonOption>
      </BoxInput>
      {2 - 2 === 0 ? (
        <IconButtonOption>
          <IconOption icon="fontisto:like" />
        </IconButtonOption>
      ) : (
        <IconButtonOption>
          <IconOption icon="teenyicons:send-solid" />
        </IconButtonOption>
      )}
    </RootStyle>
  );
}

export default BoxOptionChatBox;
