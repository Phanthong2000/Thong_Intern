import { Box, Card, styled, Typography, Stack, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actionStream } from '../redux/actions/callAction';
import LocalVideo from '../components/video/LocalVideo';
import RemoteVideo from '../components/video/RemoteVideo';
import { callUser, endCall } from '../utils/wssConnection';

const RootStyle = styled(Box)(({ theme }) => ({
  marginTop: '60px',
  width: '100%',
  background: theme.palette.background,
  textAlign: 'center',
  padding: theme.spacing(2, 2, 2)
}));
function VideoCall({ user }) {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const dispatch = useDispatch();
  const stream = useSelector((state) => state.call.stream);
  const remoteStream = useSelector((state) => state.call.remoteStream);
  const connection = useSelector((state) => state.call.connection);
  const callAccepted = useSelector((state) => state.call.callAccepted);
  const callEnded = useSelector((state) => state.call.callEnded);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const [socketId, setSocketId] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        dispatch(actionStream(currentStream));
      })
      .then(() => {
        const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
        console.log(userCall.socketId);
        callUser(userCall.socketId);
        setSocketId(userCall.socketId);
      })
      .catch((err) => {
        console.log('error occured when trying to get an access to get local stream');
        console.log(err);
      });
  }, []);
  const endCallVideo = () => {
    endCall(socketId);
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    navigate('/home/app');
  };
  return (
    <RootStyle>
      <Typography sx={{ fontSize: '30px' }}>Video Call</Typography>
      <Stack sx={{ width: '100%', justifyContent: 'space-between' }} direction="row">
        <LocalVideo />
        {callAccepted && <RemoteVideo />}
      </Stack>
      {callAccepted && <Typography>Accepted</Typography>}
      {callEnded && <Typography>Ended</Typography>}
      <Button onClick={endCallVideo}>End call</Button>
    </RootStyle>
  );
}

export default VideoCall;
