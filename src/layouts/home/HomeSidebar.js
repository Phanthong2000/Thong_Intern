import React from 'react';
import { styled, Box, Stack, IconButton } from '@mui/material';
import sidebarConfig from './SidebarConfig';
import MenuItem from '../../components/home/MenuItem';
import SettingItem from '../../components/home/SettingItem';

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
function HomeSidebar() {
  return (
    <RootStyle>
      <SpaceTop />
      <MenuBox>
        {sidebarConfig.map((item, index) => (
          <MenuItem key={index} path={item.path} icon={item.icon} />
        ))}
      </MenuBox>
      <SpaceBottom>
        <SettingItem />
      </SpaceBottom>
    </RootStyle>
  );
}

export default HomeSidebar;
