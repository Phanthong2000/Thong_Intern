import React, { useEffect, useState } from 'react';
import { Avatar, Box, Grid, IconButton, styled, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { io } from 'socket.io-client';
import { Icon } from '@iconify/react';
import { db } from '../firebase-config';
import { actionTestSearch } from '../redux/actions/userAction';
import BoxPost from '../components/home/main/BoxPost';
import BoxContact from '../components/home/main/BoxContact';
import {
  actionChatGetChatbox,
  actionChatGetChatboxHome,
  actionChatGetNewChatboxHome
} from '../redux/actions/chatAction';
import ModalReceivingVideoCall from '../components/video/ModalReceivingVideoCall';
import ChatBox from '../components/home/main/ChatBox';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  height: '100%',
  background: theme.palette.background,
  display: 'flex'
}));
Home.prototype = {
  user: PropTypes.object
};
// const socket = io('http://localhost:5000');
function Home({ user }) {
  const testSearch = useSelector((state) => state.user.testSearch);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalReceiving = useSelector((state) => state.call.modalReceiving);
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const newChatbox = useSelector((state) => state.chat.newChatbox);
  useEffect(() => {
    if (testSearch.length > 0) {
      navigate(`/home/other/${testSearch}`);
      dispatch(actionTestSearch(''));
      window.document.title = 'Thong Intern';
    } else {
      window.document.title = 'Home';
    }
    dispatch(
      actionChatGetChatbox({
        id: '',
        user: {}
      })
    );
    return () => null;
  }, []);
  const closeChatboxHome = () => {
    dispatch(
      actionChatGetChatboxHome({
        status: false,
        user: {}
      })
    );
  };
  const showChatboxHome = () => {
    dispatch(
      actionChatGetChatboxHome({
        status: true,
        user: chatboxHome.user
      })
    );
  };
  const onClickNewChatbox = () => {
    dispatch(actionChatGetNewChatboxHome(!newChatbox));
  };
  return (
    <RootStyle>
      {modalReceiving && <ModalReceivingVideoCall />}
      <div>{usersSocket.length}</div>
      <BoxPost user={user} />
      <BoxContact user={user} />
      {!chatboxHome.status && chatboxHome.user.id !== undefined && (
        <IconButton sx={{ position: 'fixed', right: 15, bottom: 130 }}>
          <Avatar
            onClick={showChatboxHome}
            sx={{ width: '50px', height: '50px' }}
            src={chatboxHome.user.avatar}
          />
          <Box
            onClick={closeChatboxHome}
            sx={{
              position: 'absolute',
              zIndex: 2,
              top: -5,
              right: -5,
              background: 'gray',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyItems: 'center',
              borderRadius: '30px',
              '&:hover': {
                background: 'lightgrey'
              }
            }}
          >
            <Icon style={{ width: '30px', height: '30px' }} icon="eva:close-fill" />
          </Box>
        </IconButton>
      )}
      {!newChatbox ? (
        <IconButton
          onClick={onClickNewChatbox}
          sx={{ position: 'fixed', right: 20, bottom: 50, background: '#fff' }}
        >
          <Icon
            style={{ width: '40px', height: '40px', color: '#000' }}
            icon="bxs:message-alt-add"
          />
        </IconButton>
      ) : (
        <IconButton
          onClick={onClickNewChatbox}
          sx={{ position: 'fixed', right: 20, bottom: 50, background: '#fff' }}
        >
          <Icon style={{ width: '40px', height: '40px', color: '#000' }} icon="bxs:message-alt-x" />
        </IconButton>
      )}
    </RootStyle>
  );
}

export default Home;
