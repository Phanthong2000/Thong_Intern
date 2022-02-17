import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  ListItem,
  ListItemButton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetAllFriendRequest, actionGetAllFriendUser } from '../redux/actions/userAction';

const heightScreen = window.innerHeight;
const RootStyle = styled(Box)(({ theme }) => ({
  background: theme.palette.background,
  minHeight: `${heightScreen - 60.4}px`,
  marginTop: '60px',
  display: 'flex'
}));
const FriendsSidebar = styled(Card)(({ theme }) => ({
  width: '350px',
  height: `${heightScreen - 60.4}px`,
  marginLeft: '20px',
  background: '#fff',
  position: 'fixed',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    marginLeft: '0px',
    width: '200px'
  }
}));
const Title = styled(Typography)(() => ({
  fontFamily: 'inherit',
  fontWeight: 'bold',
  fontSize: '25px'
}));
const ButtonSidebar = styled(Button)(({ theme }) => ({
  width: '100%',
  color: '#000',
  display: 'flex',
  height: '100px',
  justifyContent: 'space-between',
  textTransform: 'none',
  ':hover': {
    background: theme.palette.background
  }
}));
const BoxIcon = styled(Box)(({ theme }) => ({
  background: theme.palette.background,
  width: '40px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '40px'
}));
const TextButton = styled(Typography)(() => ({
  fontFamily: 'inherit',
  fontSize: '16px',
  fontWeight: 'bold',
  marginLeft: '20px'
}));
const BoxOutletFriends = styled(Box)(({ theme }) => ({
  width: '100%',
  flexGrow: 1,
  minHeight: '100%',
  marginLeft: '360px',
  marginRight: '10px',
  [theme.breakpoints.down('md')]: {
    marginLeft: '210px'
  }
}));
Friends.prototype = {
  user: PropTypes.object
};
function Friends({ user }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const goToFriendRequests = () => {
    navigate('/home/friends/friend-requests');
  };
  const goToAllFriends = () => {
    navigate('/home/friends/all-friends');
  };
  return (
    <RootStyle>
      <FriendsSidebar>
        <Title>Friends</Title>
        <ButtonSidebar
          onClick={goToFriendRequests}
          sx={{
            marginTop: '20px',
            background: pathname === '/home/friends/friend-requests' ? '#ddfc92' : '#fff'
          }}
        >
          <BoxIcon>
            <Icon
              style={{ width: '30px', height: '30px' }}
              icon="ant-design:user-switch-outlined"
            />
          </BoxIcon>
          <TextButton>Friend Requests</TextButton>
          <Icon style={{ width: '30px', height: '30px' }} icon="codicon:chevron-right" />
        </ButtonSidebar>
        <ButtonSidebar
          sx={{ background: pathname === '/home/friends/all-friends' ? '#ddfc92' : '#fff' }}
          onClick={goToAllFriends}
        >
          <BoxIcon>
            <Icon style={{ width: '30px', height: '30px' }} icon="ant-design:user-outlined" />
          </BoxIcon>
          <TextButton>All Friends</TextButton>
          <Icon style={{ width: '30px', height: '30px' }} icon="codicon:chevron-right" />
        </ButtonSidebar>
      </FriendsSidebar>
      <BoxOutletFriends>
        <Outlet />
      </BoxOutletFriends>
    </RootStyle>
  );
}

export default Friends;
