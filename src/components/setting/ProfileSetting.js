import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Divider, styled, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
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
ProfileSetting.prototype = {
  user: PropTypes.object
};
function ProfileSetting({ user }) {
  const [username, setUsername] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    setUsername(user.username);
    return () => null;
  }, [user]);
  const changeUsername = () => {
    updateDoc(doc(db, 'users', user.id), {
      username
    }).then(() => {
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Change name success',
          type: 'success'
        })
      );
      window.location.reload();
    });
  };
  if (username === undefined) return null;
  return (
    <RootStyle>
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Profile settings</Typography>
      <Divider sx={{ margin: '20px 0px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Name: </Typography>
        <TextField
          sx={{ marginLeft: '20px', width: '50%' }}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Input name"
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <ButtonSaveChange
          onClick={changeUsername}
          sx={{ background: username === user.username && 'lightgrey' }}
          disabled={Boolean(user.username === username)}
        >
          Save change
        </ButtonSaveChange>
      </Box>
    </RootStyle>
  );
}

export default ProfileSetting;
