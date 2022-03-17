import React, { useEffect, useState } from 'react';
import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(https://wallpaperaccess.com/full/2005054.jpg)`,
  backgroundRepeat: 'no-repeat'
}));
const FormForgetPassword = styled(Box)(({ theme }) => ({
  width: '50%',
  background: '#fff',
  borderRadius: '20px',
  padding: theme.spacing(3),
  textAlign: 'center'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '20px'
}));
const Input = styled(TextField)(({ theme }) => ({
  width: '80%',
  marginTop: '20px'
}));
const ButtonNext = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'none',
  color: '#fff',
  background: theme.palette.button,
  width: '80%',
  marginTop: '20px',
  fontSize: '16px'
}));
const ButtonBack = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'none',
  color: '#fff',
  background: 'gray',
  width: '80%',
  marginTop: '20px',
  ':hover': {
    background: 'gray'
  }
}));
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [test, setTest] = useState(1);
  useEffect(() => {
    window.addEventListener('click', (e) => {
      console.log(e);
      console.log('window');
    });
    document.title = 'Forgot password';
    return () => null;
  }, []);

  const next = () => {
    getDocs(query(collection(db, 'users'), where('email', '==', email))).then((snapshots) => {
      if (snapshots.empty) {
        setError('Email is not exists');
      } else {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            setError('');
            console.log('ok');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const back = (e) => {
    e.stopPropagation();
    console.log('back');
    // navigate('/login');
  };
  return (
    <RootStyle>
      <FormForgetPassword>
        <Title>Forgot password</Title>
        <Box>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
          <Typography sx={{ color: 'red', marginTop: '10px' }}>{error}</Typography>
          <ButtonNext onClick={next}>Next</ButtonNext>
          <ButtonBack onClick={back}>Back</ButtonBack>
        </Box>
      </FormForgetPassword>
    </RootStyle>
  );
}

export default ForgotPassword;
