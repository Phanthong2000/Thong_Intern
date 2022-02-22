import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar, Box, Card, IconButton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

const RootStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1),
  width: '100%',
  background: '#fff',
  marginLeft: '10px',
  marginTop: '10px',
  display: 'flex',
  height: '80px',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const ButtonOptions = styled(IconButton)(({ theme }) => ({
  color: theme.palette.green,
  marginRight: '10px'
}));
BoxInfoChatgroup.prototype = {
  user: PropTypes.object,
  chatbox: PropTypes.object
};
function BoxInfoChatgroup({ user }) {
  const chatbox = useSelector((state) => state.chat.chatbox);
  const checkQuantityMemberChatgroup = () => {
    if (chatbox.members >= 0) return `${chatbox.members.length} member`;
    return `${chatbox.members.length} members`;
  };
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: '40px', height: '40px' }} src={chatbox.avatar} />
        <Box sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'sans-serif' }}>
            {chatbox.name}
          </Typography>
          <Typography sx={{ fontFamily: 'inherit', fontSize: '14px', color: 'gray' }}>
            {checkQuantityMemberChatgroup()}
          </Typography>
        </Box>
      </Box>
      <Box>
        <ButtonOptions>
          <Icon icon="fluent:call-48-filled" />
        </ButtonOptions>
        <ButtonOptions>
          <Icon icon="bi:camera-video-fill" />
        </ButtonOptions>
        <ButtonOptions>
          <Icon icon="entypo:info-with-circle" />
        </ButtonOptions>
      </Box>
    </RootStyle>
  );
}

export default BoxInfoChatgroup;
