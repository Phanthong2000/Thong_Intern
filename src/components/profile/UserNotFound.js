import React from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100%',
  textAlign: 'center',
  marginTop: '60px'
}));
const IconNotFound = styled(Icon)(({ theme }) => ({
  width: '300px',
  height: '300px',
  color: theme.palette.green
}));
const TextNotFound = styled(Typography)(({ theme }) => ({
  color: theme.palette.green,
  fontFamily: 'inherit',
  fontSize: '30px',
  fontWeight: 'bold'
}));
const ButtonGoToHome = styled(Button)(({ theme }) => ({
  color: '#fff',
  marginTop: '20px',
  background: theme.palette.green,
  textTransform: 'none',
  width: '200px',
  fontSize: '20px',
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  ':hover': {
    background: 'lightgreen'
  }
}));
function UserNotFound() {
  const navigate = useNavigate();
  return (
    <RootStyle>
      <IconNotFound icon="healthicons:not-ok" />
      <TextNotFound>USER NOT FOUND</TextNotFound>
      <ButtonGoToHome
        onClick={() => {
          navigate('/home/app');
        }}
      >
        Go to Home
      </ButtonGoToHome>
    </RootStyle>
  );
}

export default UserNotFound;
