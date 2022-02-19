import React, { useEffect } from 'react';
import { styled, Box, Stack, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import sidebarConfig from './SidebarConfig';
import MenuItem from '../../components/home/MenuItem';
import SettingItem from '../../components/home/SettingItem';
import {
  actionGetAllFriendRequest,
  actionGetAllFriendUser,
  actionGetAllFriendUserManual,
  actionUserBroadcastSocket
} from '../../redux/actions/userAction';
import { actionGetAllPostAllFriend } from '../../redux/actions/postAction';
import { actionGetAllChat, actionGetAllChatSort } from '../../redux/actions/chatAction';
import { connectWithSocket, registerUser } from '../../utils/wssConnection';
import ModalReceivingVideoCall from '../../components/video/ModalReceivingVideoCall';

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
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const isLoadingFriendRequest = useSelector((state) => state.user.isLoadingFriendRequest);
  const friendManual = useSelector((state) => state.user.friendManual);
  const me = useSelector((state) => state.call.me);
  useEffect(() => {
    if (user.id !== undefined) {
      dispatch(actionGetAllFriendRequest(user.id));
      dispatch(actionGetAllFriendUserManual(user.id));
      dispatch(actionGetAllFriendUser(user.id));
      // dispatch(actionGetAllChat(user.id));
      dispatch(actionGetAllChatSort(user.id));
    }
    return () => null;
  }, [user]);
  useEffect(() => {
    if (user.id) dispatch(actionGetAllPostAllFriend(user.id, friendManual));
  }, [user]);
  useEffect(() => {
    if (user.id !== undefined && me !== '') {
      registerUser({ userId: user.id, socketId: me });
    }
  }, [user]);
  return (
    <RootStyle>
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
