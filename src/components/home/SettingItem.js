import React from 'react';
import { Icon } from '@iconify/react';
import { IconButton, styled } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

function SettingItem() {
  const location = useLocation();
  const path = '/home/setting';
  return (
    <NavLink to="/home/setting">
      <IconButton sx={location.pathname === path ? { background: '#fff', color: '#000' } : null}>
        <Icon
          icon="ant-design:setting-filled"
          color={location.pathname === path ? '#30ab78' : '#fff'}
        />
      </IconButton>
    </NavLink>
  );
}

export default SettingItem;
