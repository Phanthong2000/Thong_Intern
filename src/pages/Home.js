import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';
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
import Snack from '../components/Snack';
import Chatgroup from '../components/home/main/Chatgroup';
import BoxYourPage from '../components/home/main/BoxYourPage';
import BoxFriendRequests from '../components/home/main/BoxFriendRequests';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  display: 'flex'
}));
const StackContact = styled(Box)(({ theme }) => ({
  height: `${heightScreen - 60}px`,
  maxHeight: `${heightScreen - 60}px`,
  display: 'flex',
  width: '30%'
}));
Home.prototype = {
  user: PropTypes.object
};
function Home() {
  const dispatch = useDispatch();
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const newChatbox = useSelector((state) => state.chat.newChatbox);
  const chatgroups = useSelector((state) => state.chat.chatgroups);
  useEffect(() => {
    // if (testSearch.length > 0) {
    //   navigate(`/home/other/${testSearch}`);
    //   dispatch(actionTestSearch(''));
    //   window.document.title = 'Thong Intern';
    // } else {
    window.document.title = 'Home';
    // }
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
        user: chatboxHome.user,
        chatbox: chatboxHome
      })
    );
  };
  const onClickNewChatbox = () => {
    dispatch(actionChatGetNewChatboxHome(!newChatbox));
  };
  return (
    <RootStyle>
      <div>{usersSocket.length}</div>
      <BoxPost />
      <StackContact>
        <Scrollbar alwaysShowTracks>
          <BoxYourPage />
          <BoxFriendRequests />
          <BoxContact />
          <Box>
            <Typography
              sx={{ color: 'gray', fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}
            >
              Group conversations
            </Typography>
            {chatgroups.map((item, index) => (
              <Chatgroup key={index} chatgroup={item} />
            ))}
          </Box>
        </Scrollbar>
      </StackContact>
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
      <Snack />
    </RootStyle>
  );
}

export default Home;
