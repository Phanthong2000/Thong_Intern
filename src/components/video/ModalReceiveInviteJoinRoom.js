import React from 'react';
import { Box, Button, Card, IconButton, Modal, Stack, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { keyframes } from '@emotion/react';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import {
  actionModalReceiveInviteJoinRoom,
  actionModalReceiving,
  actionStream
} from '../../redux/actions/callAction';
import { answerCall, endCall } from '../../utils/wssConnection';
import { db } from '../../firebase-config';
import { actionGetAllChatSort, actionChatAddMessage } from '../../redux/actions/chatAction';

const anim = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.375;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;
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
const BoxRipple = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(2),
  border: `1px solid green`
}));
function ModalReceiveInviteJoinRoom() {
  const modalReceiveInviteJoinRoom = useSelector((state) => state.call.modalReceiveInviteJoinRoom);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    dispatch(
      actionModalReceiveInviteJoinRoom({
        status: false,
        name: '',
        roomId: ''
      })
    );
  };
  const accept = () => {
    navigate(`/home/video-room/${modalReceiveInviteJoinRoom.roomId}`);
    handleClose();
  };
  return (
    <Modal open={modalReceiveInviteJoinRoom.status} onClose={handleClose}>
      <RootStyle>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '20px' }}>
            {modalReceiveInviteJoinRoom.name} invited you join their room
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <IconButton
              sx={{
                border: `1px solid green`,
                width: '70px',
                height: '70px',
                animation: `${anim} 3s ease forwards infinite`
              }}
            >
              <Icon
                style={{ color: '#fff', width: '40px', height: '40px' }}
                icon="bi:phone-vibrate-fill"
              />
            </IconButton>
          </Box>
          <Stack
            direction="row"
            sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
          >
            <Icon
              onClick={accept}
              style={{ width: '50px', height: '50px', color: 'greenyellow', cursor: 'pointer' }}
              icon="ic:baseline-check-circle"
            />
            <Icon
              onClick={handleClose}
              style={{ width: '50px', height: '50px', color: 'red', cursor: 'pointer' }}
              icon="ic:baseline-remove-circle"
            />
          </Stack>
        </Box>
      </RootStyle>
    </Modal>
  );
}

export default ModalReceiveInviteJoinRoom;
