import React from 'react';
import { IconButton, styled } from '@mui/material';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';

const RootStyle = styled(NavLink)(({ theme }) => ({
  width: '80px',
  justifyContent: 'center',
  display: 'flex',
  background: theme.palette.green
}));
const WrapIcon = styled('div')(({ theme }) => ({
  justifyContent: 'center',
  display: 'flex',
  height: '70px',
  width: '70px',
  background: theme.palette.green,
  marginLeft: '10px',
  borderTopLeftRadius: '70px',
  borderBottomLeftRadius: '70px'
}));
const Space1 = styled('div')(({ theme }) => ({
  height: '20px',
  background: theme.palette.green,
  borderBottomRightRadius: '20px',
  width: '80px'
}));
const Space2 = styled('div')(({ theme }) => ({
  height: '20px',
  background: theme.palette.green,
  borderTopRightRadius: '20px',
  width: '80px'
}));
MenuItem.prototype = {
  path: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};
function MenuItem({ path, icon }) {
  const location = useLocation();
  return (
    <>
      {location.pathname === path ? <Space1 /> : null}
      <RootStyle to={path}>
        <WrapIcon style={location.pathname === path ? { background: '#f5f7f6' } : null}>
          <IconButton>
            <Icon
              icon={icon}
              style={
                location.pathname === path
                  ? { color: '#30ab78', width: '30px', height: '30px' }
                  : { color: '#fff' }
              }
            />
          </IconButton>
        </WrapIcon>
      </RootStyle>
      {location.pathname === path ? <Space2 /> : null}
    </>
  );
}

export default MenuItem;
