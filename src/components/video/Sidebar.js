import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper, styled } from '@mui/material';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';

import { SocketContext } from '../../Context';

const RootStyle = styled(Container)(({ theme }) => ({
  width: '100%',
  margin: '35px 0',
  display: 'flex',
  padding: 0,
  [theme.breakpoints.down('xs')]: {
    width: '80%'
  }
}));
const FormVideo = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column'
}));
const PaperVideo = styled(Paper)(() => ({
  padding: '10px 20px',
  border: '2px solid black',
  width: '100%'
}));
const GridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column'
  }
}));

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  useEffect(() => {
    console.log(me);
  }, []);
  return (
    <RootStyle>
      <PaperVideo elevation={10}>
        <Grid sx={{ width: '100%' }} container>
          <Grid sx={{ display: 'block', width: '100%' }} item xl={6} lg={6}>
            <Typography>Account Info</Typography>
            <TextField
              label="Name"
              value={me}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              placeholder="Input your name"
            />
            <Button>Copy your id</Button>
          </Grid>
          <Grid item xl={6} lg={6}>
            <Typography>Make a call</Typography>
            <TextField
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              fullWidth
              placeholder="Input id call"
            />
            {callAccepted && !callEnded ? (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PhoneDisabled fontSize="large" />}
                fullWidth
                onClick={leaveCall}
              >
                Hang Up
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone fontSize="large" />}
                fullWidth
                onClick={() => callUser(idToCall)}
              >
                Call
              </Button>
            )}
          </Grid>
        </Grid>
        {children}
      </PaperVideo>
    </RootStyle>
  );
};

export default Sidebar;
