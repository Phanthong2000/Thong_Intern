import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, styled, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RemoteVideo from '../components/room/RemoteVideo';
import Participants from '../components/room/Participants';
import LocalVideo from '../components/room/LocalVideo';
import { actionLocalStreamGroup } from '../redux/actions/callAction';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  marginTop: '10px',
  fontFamily: 'sans-serif'
}));
Room.prototype = {
  user: PropTypes.object
};
function Room({ user }) {
  const { id } = useParams();
  const group = useSelector((state) => state.call.group);
  const dispatch = useDispatch();
  const localStreamGroup = useSelector((state) => state.call.localStreamGroup);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        dispatch(actionLocalStreamGroup(currentStream));
      })
      .then(() => {
        console.log('group');
        // const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
        // callUser(userCall.socketId, user.username);
      })
      .catch((err) => {
        console.log('error occured when trying to get an access to get local stream');
        console.log(err);
      });
    return () => null;
  }, []);
  return (
    <RootStyle>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Title>
          Video call group: <b>{`${group.chatgroup.name}`}</b>
        </Title>
      </Box>
      <Grid container>
        <Grid sx={{ padding: '20px' }} item xs={12} sm={12} md={8} lg={8} xl={8}>
          <RemoteVideo />
        </Grid>
        <Grid sx={{ padding: '20px' }} item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Participants />
          <LocalVideo />
        </Grid>
      </Grid>
    </RootStyle>
  );
}

export default Room;
