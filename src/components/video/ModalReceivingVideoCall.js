import React from 'react';
import { Button, Card, Modal, Stack, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actionModalReceiving, actionStream } from '../../redux/actions/callAction';
import { answerCall } from '../../utils/wssConnection';

const RootStyle = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '300px',
  height: '300px',
  textAlign: 'center',
  background: theme.palette.green,
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
function ModalReceivingVideoCall() {
  const modalReceiving = useSelector((state) => state.call.modalReceiving);
  const name = useSelector((state) => state.call.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const answerVideoCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        dispatch(actionStream(currentStream));
      })
      .then(() => {
        answerCall();
        dispatch(actionModalReceiving(false));
        navigate('/home/video-call');
      });
  };
  return (
    <Modal open onClose={() => dispatch(actionModalReceiving(false))}>
      <RootStyle>
        <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '20px' }}>
          {name} is calling
        </Typography>
        <Stack direction="row">
          <Button onClick={answerVideoCall} sx={{ color: '#fff', width: '50%' }}>
            Accepted
          </Button>
          <Button sx={{ color: '#fff', width: '50%' }}>Decline</Button>
        </Stack>
      </RootStyle>
    </Modal>
  );
}

export default ModalReceivingVideoCall;
