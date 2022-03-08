import { Box, Button, Card, styled, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { actionChatGetChatbox } from '../redux/actions/chatAction';
import Snack from '../components/Snack';

const heightScreen = window.innerHeight;
const RootStyle = styled(Box)(({ theme }) => ({
  background: theme.palette.background,
  minHeight: `${heightScreen - 60.4}px`,
  marginTop: '60px',
  display: 'flex'
}));
const SettingsSidebar = styled(Card)(({ theme }) => ({
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
const BoxOutletSettings = styled(Box)(({ theme }) => ({
  width: '100%',
  flexGrow: 1,
  minHeight: '100%',
  marginLeft: '380px',
  marginRight: '10px',
  marginTop: '10px',
  [theme.breakpoints.down('md')]: {
    marginLeft: '210px'
  }
}));
Setting.prototype = {
  user: PropTypes.object
};
function Setting({ user }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const goToProfileSetting = () => {
    navigate('/home/setting/profile-setting');
  };
  const goToPasswordSetting = () => {
    navigate('/home/setting/password-setting');
  };
  return (
    <RootStyle>
      <SettingsSidebar>
        <Title>Settings</Title>
        <ButtonSidebar
          onClick={goToProfileSetting}
          sx={{
            marginTop: '20px',
            background: pathname === '/home/setting/profile-setting' ? '#ddfc92' : '#fff'
          }}
        >
          <BoxIcon>
            <Icon style={{ width: '30px', height: '30px' }} icon="healthicons:ui-user-profile" />
          </BoxIcon>
          <TextButton>Profile settings</TextButton>
          <Icon style={{ width: '30px', height: '30px' }} icon="codicon:chevron-right" />
        </ButtonSidebar>
        <ButtonSidebar
          onClick={goToPasswordSetting}
          sx={{ background: pathname === '/home/setting/password-setting' ? '#ddfc92' : '#fff' }}
        >
          <BoxIcon>
            <Icon style={{ width: '30px', height: '30px' }} icon="ri:lock-password-fill" />
          </BoxIcon>
          <TextButton>Password settings</TextButton>
          <Icon style={{ width: '30px', height: '30px' }} icon="codicon:chevron-right" />
        </ButtonSidebar>
      </SettingsSidebar>
      <BoxOutletSettings>
        <Outlet />
        <Snack />
      </BoxOutletSettings>
    </RootStyle>
  );
}

export default Setting;
