import React, { useEffect, useState } from 'react';
import { styled, Box, Stack, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Aos from 'aos';
import toast, { Toaster } from 'react-hot-toast';
import { getToken, getMessaging } from 'firebase/messaging';
import 'aos/dist/aos.css';
import sidebarConfig from './SidebarConfig';
import MenuItem from '../../components/home/MenuItem';
import SettingItem from '../../components/home/SettingItem';
import {
  actionGetAllFriendRequest,
  actionGetAllFriendUser,
  actionGetAllFriendUserManual,
  actionGetAllNotifications,
  actionGetBadgeNotifications,
  actionGetFriendsHaveStory,
  actionGetStoryUser,
  actionSearchAllPeople,
  actionUserBroadcastSocket,
  actionUserGetTokenMessaging
} from '../../redux/actions/userAction';
import { actionGetAllPostAllFriend } from '../../redux/actions/postAction';
import {
  actionGetAllChat,
  actionGetAllChatSort,
  actionGetChatgroupUser,
  actionGetAllBadeMessage
} from '../../redux/actions/chatAction';
import { registerUser } from '../../utils/wssConnection';
import ModalReceivingVideoCall from '../../components/video/ModalReceivingVideoCall';

import { messaging, onMessageListener } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '80px',
  minHeight: '100%',
  position: 'fixed'
}));
const MenuBox = styled(Stack)(({ theme }) => ({
  background: '#f5f7f6'
}));
const SpaceTop = styled('div')(({ theme }) => ({
  width: '80px',
  minHeight: '80px',
  background: theme.palette.green
}));
const SpaceBottom = styled(Box)(({ theme }) => ({
  width: '80px',
  background: theme.palette.green,
  height: '600px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));
HomeSidebar.prototype = {
  user: PropTypes.object
};
// const socket = io('http://localhost:5000');
function HomeSidebar({ user }) {
  const dispatch = useDispatch();
  const tokenMessaging = useSelector((state) => state.user.tokenMessaging);
  const me = useSelector((state) => state.call.me);
  useEffect(() => {
    if (user.id !== undefined) {
      Aos.init({ duration: 1000 });
      dispatch(actionGetAllFriendRequest(user.id));
      dispatch(actionGetAllFriendUserManual(user.id));
      dispatch(actionGetAllFriendUser(user.id));
      dispatch(actionGetAllChatSort(user.id));
      dispatch(actionGetAllPostAllFriend(user.id));
      dispatch(actionGetAllNotifications(user.id));
      dispatch(actionGetBadgeNotifications(user.id));
      dispatch(actionGetChatgroupUser(user.id));
      dispatch(actionGetStoryUser(user.id));
      dispatch(actionGetFriendsHaveStory(user.id));
      dispatch(actionGetAllBadeMessage(user.id));
      // if (tokenMessaging === '') {
      //   Notification.requestPermission().then((permission) => {
      //     if (permission === 'granted') {
      //       getToken(messaging, { vapidKey: process.env.PUBLIC_VAPID_KEY })
      //         .then((currentToken) => {
      //           if (currentToken) {
      //             dispatch(actionUserGetTokenMessaging(currentToken));
      //             // getMessaging()
      //             //   .subscribeToTopic(currentToken, 'test')
      //             //   .then((response) => {
      //             //     console.log('Successfully subscribed to topic:', response);
      //             //   })
      //             //   .catch((error) => {
      //             //     console.log('Error subscribing to topic:', error);
      //             //   });
      //             console.log(currentToken);
      //           } else {
      //             console.log(
      //               'No registration token available. Request permission to generate one.'
      //             );
      //           }
      //         })
      //         .catch((err) => {
      //           console.log('An error occurred while retrieving token. ', err);
      //         });
      //     }
      //   });
      // }
    }
    return () => null;
  }, [user]);
  useEffect(() => {
    if (user.id !== undefined && me !== '') {
      registerUser({ userId: user.id, socketId: me });
    }
    return () => null;
  }, [user]);
  return (
    <RootStyle>
      <Toaster />
      <SpaceTop />
      <MenuBox>
        {sidebarConfig.map((item, index) => (
          <MenuItem user={user} key={index} path={item.path} icon={item.icon} />
        ))}
      </MenuBox>
      <SpaceBottom>
        <SettingItem />
      </SpaceBottom>
    </RootStyle>
  );
}

export default HomeSidebar;
