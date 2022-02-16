import React from 'react';
import { Avatar, Box, Card, IconButton, Skeleton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

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
const IsOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  right: 5,
  bottom: 5,
  width: '15px',
  height: '15px',
  color: theme.palette.green
}));
const ButtonOptions = styled(IconButton)(({ theme }) => ({
  color: theme.palette.green,
  marginRight: '10px'
}));
BoxInfoUserChat.prototype = {
  user: PropTypes
};
function BoxInfoUserChat({ user }) {
  const chatbox = useSelector((state) => state.chat.chatbox);
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {chatbox.id !== '' ? (
          <IconButton>
            <Avatar sx={{ width: '40px', height: '40px' }} src={chatbox.user.avatar} />
            <IsOnline
              icon="akar-icons:circle-fill"
              style={{ color: !chatbox.user.isOnline ? 'gray' : null }}
            />
          </IconButton>
        ) : (
          <Skeleton variant="circular" sx={{ width: '40px', height: '40px' }} />
        )}
        <Box sx={{ marginLeft: '10px' }}>
          {chatbox.id !== '' ? (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'sans-serif' }}>
                {chatbox.user.username}
              </Typography>
              <Typography sx={{ fontFamily: 'inherit', fontSize: '14px', color: 'gray' }}>
                {chatbox.user.isOnline ? `Online` : `Offline`}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton variant="text" sx={{ width: '150px', height: '20px' }} />
              <Skeleton variant="text" sx={{ width: '50px', height: '20px' }} />
            </>
          )}
        </Box>
      </Box>{' '}
      {chatbox.id !== '' ? (
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
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Skeleton
            variant="circular"
            sx={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          <Skeleton
            variant="circular"
            sx={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          <Skeleton
            variant="circular"
            sx={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
        </Box>
      )}
    </RootStyle>
  );
}

export default BoxInfoUserChat;
