import { Box, Button, Card, Divider, styled, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const RootStyle = styled(Card)(() => ({
  width: '100%',
  background: '#fff',
  padding: '20px'
}));
const ButtonSaveChange = styled(Button)(({ theme }) => ({
  background: theme.palette.green,
  textTransform: 'none',
  color: '#fff',
  fontWeight: 'bold',
  ':hover': {
    background: theme.palette.green
  }
}));
const LabelInput = styled(Typography)(() => ({
  width: '30%',
  fontWeight: 'bold',
  fontSize: '18'
}));
PasswordSetting.prototype = {
  user: PropTypes.object
};
function PasswordSetting({ user }) {
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [error, setError] = useState(0);
  const dispatch = useDispatch();
  const saveChange = () => {
    if (current !== user.password) {
      setError(1);
    } else if (!newPassword.match('^.{6,32}$')) {
      setError(2);
    } else if (newPassword !== reNewPassword) {
      setError(3);
    } else if (newPassword === current) {
      setError(4);
    } else {
      setError(0);
      updatePassword(auth.currentUser, newPassword).then(() => {
        updateDoc(doc(db, 'users', user.id), {
          password: newPassword
        }).then(() => {
          dispatch(
            actionOpenSnackbar({
              status: true,
              content: 'Change password success',
              type: 'success'
            })
          );
          window.location.reload();
        });
      });
    }
  };
  return (
    <RootStyle>
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Password settings</Typography>
      <Divider sx={{ margin: '20px 0px' }} />
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <LabelInput>Current</LabelInput>
        <TextField
          error={Boolean(error === 1)}
          type="password"
          value={current}
          helperText={error === 1 && 'Enter a valid password and try again'}
          onChange={(e) => setCurrent(e.target.value)}
          sx={{ width: '50%' }}
          fullWidth
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <LabelInput>New</LabelInput>
        <TextField
          error={Boolean(error === 2) || Boolean(error === 4)}
          type="password"
          value={newPassword}
          helperText={
            (error === 2 && 'Password must contain 6-32 characters') ||
            (error === 4 && 'Password must differ from old password')
          }
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ width: '50%' }}
          fullWidth
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <LabelInput>Re-type new</LabelInput>
        <TextField
          helperText={error === 3 && 'Passwords do not match'}
          type="password"
          error={Boolean(error === 3)}
          value={reNewPassword}
          onChange={(e) => setReNewPassword(e.target.value)}
          sx={{ width: '50%' }}
          fullWidth
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <ButtonSaveChange onClick={saveChange}>Save change</ButtonSaveChange>
      </Box>
    </RootStyle>
  );
}

export default PasswordSetting;
