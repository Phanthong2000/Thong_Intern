import React, { useEffect, useState } from 'react';
import { styled, Box, Stack, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Aos from 'aos';
import toast, { Toaster } from 'react-hot-toast';
// import { getToken, getMessaging } from 'firebase/messaging';
import 'aos/dist/aos.css';
import sidebarConfig from './SidebarConfig';
import MenuItem from '../../components/home/MenuItem';
import SettingItem from '../../components/home/SettingItem';

// import { messaging, onMessageListener } from '../../firebase-config';

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
