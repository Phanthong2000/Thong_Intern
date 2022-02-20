import React from 'react';
import { Box, Card, Divider, IconButton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';
import UserChat from '../chat/UserChat';

const RootStyle = styled(Card)(() => ({
  width: '400px',
  position: 'absolute',
  minHeight: '100px',
  top: '60px',
  right: '10px',
  background: '#fff',
  borderRadius: '0px 0px 20px 20px',
  padding: '5px'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '20px',
  fontFamily: 'sans-serif'
}));
const BoxOptions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '60px'
}));
const BoxChatBox = styled(Box)(() => ({
  width: '100%',
  minHeight: '50px',
  maxHeight: '400px',
  display: 'flex'
}));
BoxMessager.prototype = {
  user: PropTypes.object
};
function BoxMessager({ user }) {
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  return (
    <RootStyle elevation={3}>
      <BoxOptions>
        <Title>Messenger</Title>
        <Box sx={{ display: 'flex' }}>
          <IconButton>
            <Icon icon="bxs:message-alt-add" />
          </IconButton>
          <IconButton>
            <Icon icon="bi:three-dots" />
          </IconButton>
        </Box>
      </BoxOptions>
      <Divider />
      <BoxChatBox>
        {chatboxs.length === 0 ? (
          <Box sx={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Empty messenger</Typography>
          </Box>
        ) : (
          <Scrollbar alwaysShowTracks>
            {chatboxs.map((item, index) => (
              <UserChat user={user} key={index} home chatbox={item} />
            ))}
          </Scrollbar>
        )}
      </BoxChatBox>
    </RootStyle>
  );
}

export default BoxMessager;
