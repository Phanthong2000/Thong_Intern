import React, { useEffect } from 'react';
import { Logout, Settings } from '@mui/icons-material';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import {
  actionUserLogout,
  actionUserCloseProfile,
  actionUserGetAllFriendRequest
} from '../../redux/actions/userAction';

const BootStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '10px',
  background: '#fff',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  width: '400px',
  top: '60px',
  color: '#000',
  paddingBottom: '10px'
}));
const InfoItem = styled(Stack)(({ theme }) => ({
  color: '#000',
  marginLeft: '20px'
}));
const Separate = styled(Divider)(({ theme }) => ({
  width: '90%',
  marginLeft: '5%',
  marginTop: '10px',
  marginBottom: '10px'
}));
const NameItem = styled(Typography)(({ theme }) => ({
  marginLeft: '20px',
  fontSize: '18px'
}));
const IsOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  right: 5,
  bottom: 5,
  width: '15px',
  height: '15px',
  color: theme.palette.green
}));
BoxProfile.prototype = {
  user: PropTypes.object
};
function BoxProfile({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.removeItem('user');
    dispatch(actionUserLogout());
    navigate('/login');
  };
  const gotoProfile = () => {
    dispatch(actionUserCloseProfile());
    navigate(`/home/profile/${user.id}`);
  };
  return (
    <BootStyle sx={{ boxShadow: 3 }}>
      <List>
        <ListItem>
          <ListItemButton onClick={() => gotoProfile()}>
            <IconButton disableTouchRipple disableFocusRipple disableRipple>
              <IsOnline icon="akar-icons:circle-fill">s</IsOnline>
              <Avatar src={user.avatar} />
            </IconButton>
            <InfoItem>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>{user.username}</Typography>
              <Typography>See your profile</Typography>
            </InfoItem>
          </ListItemButton>
        </ListItem>
        <Separate />
        <ListItem>
          <ListItemButton>
            <Settings />
            <NameItem>Settings</NameItem>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => logout()}>
            <Logout />
            <NameItem>Log Out</NameItem>
          </ListItemButton>
        </ListItem>
      </List>
    </BootStyle>
  );
}

export default BoxProfile;
