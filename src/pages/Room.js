import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, IconButton, styled, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import RemoteVideo from '../components/room/RemoteVideo';
import Participants from '../components/room/Participants';
import LocalVideo from '../components/room/LocalVideo';
import { actionLocalStreamGroup } from '../redux/actions/callAction';
import { callGroup, endCallGroup, outRoomCallGroup } from '../utils/wssConnection';
import Signal from '../components/room/Signal';

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
  const remoteStreamGroup = useSelector((state) => state.call.remoteStreamGroup);
  const callAcceptedGroup = useSelector((state) => state.call.callAcceptedGroup);
  const participants = useSelector((state) => state.call.participants);
  const signalGroup = useSelector((state) => state.call.signalGroup);
  const socketIds = useSelector((state) => state.call.socketIds);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const callEndedGroup = useSelector((state) => state.call.callEndedGroup);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        dispatch(actionLocalStreamGroup(currentStream));
      })
      .then(() => {
        if (group.userCreate.userId === user.id) {
          callGroup(socketIds, group);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => null;
  }, []);
  useEffect(() => {
    if (count === 1) {
      navigate('/home/app');
      window.location.reload();
    }
    setCount(1);
    return () => {
      setCount(0);
    };
  }, [callEndedGroup]);
  const endCall = () => {
    endCallGroup();
  };
  const outRoom = () => {
    const memberNew = participants.members.filter((item) => item.userId !== user.id);
    console.log(memberNew);
    outRoomCallGroup({
      ...participants,
      members: memberNew
    });
    navigate('/home/app');
    window.location.reload();
  };
  return (
    <RootStyle>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <div>peer: {signalGroup.length}</div>
        <div>remote: {remoteStreamGroup.length}</div>
        <Title>
          Video call group: <b>{`${group.chatgroup.name}`}</b>
        </Title>
      </Box>
      <Grid container>
        <Grid sx={{ padding: '20px' }} item xs={12} sm={12} md={8} lg={8} xl={8}>
          {/* {signalGroup.map((item, index) => (
            <Signal key={index} signal={item} />
          ))} */}
          {remoteStreamGroup.map((item, index) => (
            <RemoteVideo remote={item} index={index} key={index} />
          ))}
        </Grid>
        <Grid sx={{ padding: '20px' }} item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Participants />
          <LocalVideo />
        </Grid>
      </Grid>
      {group.userId === user.id ? (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <IconButton onClick={endCall} sx={{ margin: '0px 50px' }}>
            <Icon
              style={{ color: 'red', width: '50px', height: '50px' }}
              icon="icomoon-free:phone-hang-up"
            />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <IconButton onClick={outRoom} sx={{ margin: '0px 50px' }}>
            <Icon
              style={{ color: 'red', width: '50px', height: '50px' }}
              icon="ion:log-out-sharp"
            />
          </IconButton>
        </Box>
      )}
    </RootStyle>
  );
}

export default Room;
