import React, { useEffect, useState } from 'react';
import { Badge, IconButton, styled } from '@mui/material';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionGetAllFriendRequest } from '../../redux/actions/userAction';

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
  icon: PropTypes.string.isRequired,
  user: PropTypes.object
};
function MenuItem({ user, path, icon }) {
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const location = useLocation();
  const BoxFriendRequest = () => {
    if (friendRequests.length > 0)
      return (
        <Badge color="error" badgeContent={friendRequests.length}>
          <Icon
            icon={icon}
            style={
              location.pathname.includes(path)
                ? { color: '#30ab78', width: '30px', height: '30px' }
                : { color: '#fff' }
            }
          />
        </Badge>
      );
    return (
      <Icon
        icon={icon}
        style={
          location.pathname.includes(path)
            ? { color: '#30ab78', width: '30px', height: '30px' }
            : { color: '#fff' }
        }
      />
    );
  };
  return (
    <>
      {location.pathname.includes(path) ? <Space1 /> : null}
      <RootStyle to={path}>
        <WrapIcon style={location.pathname.includes(path) ? { background: '#f5f7f6' } : null}>
          <IconButton>
            {path === '/home/friends' ? (
              <BoxFriendRequest />
            ) : (
              <Icon
                icon={icon}
                style={
                  location.pathname.includes(path)
                    ? { color: '#30ab78', width: '30px', height: '30px' }
                    : { color: '#fff' }
                }
              />
            )}
          </IconButton>
        </WrapIcon>
      </RootStyle>
      {location.pathname.includes(path) ? <Space2 /> : null}
    </>
  );
}

export default MenuItem;
