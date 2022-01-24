import React from 'react';
import { Button, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import logo from '../asset/images/logo.svg';

const RootStyle = styled('header')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const Logo = styled('img')(({ theme }) => ({
  width: '200px',
  height: '100px'
}));
const ButtonAuth = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to right, #06beb6 0%, #48b1bf  51%, #06beb6  100%)',
  height: '50px',
  width: '100px'
}));
const Text = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  color: '#fff'
}));

function HeaderAuth() {
  const navigate = useNavigate();
  return (
    <RootStyle>
      <Logo src={logo} alt="Logo" />
      {window.location.href.includes('signup') ? (
        <ButtonAuth
          onClick={() => {
            navigate('/login');
          }}
        >
          <Text>Login</Text>
        </ButtonAuth>
      ) : (
        <ButtonAuth
          onClick={() => {
            navigate('/signup');
          }}
        >
          <Text>Sign Up</Text>
        </ButtonAuth>
      )}
    </RootStyle>
  );
}

export default HeaderAuth;
