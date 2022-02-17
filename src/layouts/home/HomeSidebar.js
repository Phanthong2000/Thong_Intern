import React, { useEffect } from 'react';
import { styled, Box, Stack, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import sidebarConfig from './SidebarConfig';
import MenuItem from '../../components/home/MenuItem';
import SettingItem from '../../components/home/SettingItem';
import {
  actionGetAllFriendRequest,
  actionGetAllFriendUserManual
} from '../../redux/actions/userAction';

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
function HomeSidebar({ user }) {
  const dispatch = useDispatch();
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const isLoadingFriendRequest = useSelector((state) => state.user.isLoadingFriendRequest);
  useEffect(() => {
    if (user.id !== undefined) {
      dispatch(actionGetAllFriendRequest(user.id));
      dispatch(actionGetAllFriendUserManual(user.id));
    }
    return () => null;
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
