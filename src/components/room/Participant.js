import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemButton,
  Skeleton,
  styled,
  Typography
} from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionChooseParticipant } from '../../redux/actions/callAction';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  background: '#fff',
  color: theme.palette.green,
  padding: '0px 5px',
  marginTop: '10px'
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontFamily: 'inherit',
  color: '#000',
  fontSize: '14px'
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '40px',
  height: '40px'
}));
const IconOptions = styled(Icon)(({ theme }) => ({
  width: '18px',
  height: '18px',
  marginRight: '5px',
  cursor: 'pointer'
}));
Participant.prototype = {
  other: PropTypes.object,
  user: PropTypes.object,
  room: PropTypes.object
};
function Participant({ other, user, room }) {
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const turnOffVideoRoom = useSelector((state) => state.call.turnOffVideoRoom);
  const turnOffAudioRoom = useSelector((state) => state.call.turnOffAudioRoom);
  const chooseParticipant = useSelector((state) => state.call.chooseParticipant);
  const socketRef = useRef();
  const socket = useSelector((state) => state.call.socket);
  const dispatch = useDispatch();
  const choose = () => {
    if (chooseParticipant.id === other.id) dispatch(actionChooseParticipant({}));
    else dispatch(actionChooseParticipant(other));
  };
  const cedeHost = () => {
    updateDoc(doc(db, 'rooms', room.id), {
      userCreate: other
    }).then((snapshot) => {
      dispatch(actionChooseParticipant({}));
      socketRef.current = socket;
      socketRef.current.emit('cede host', {
        roomId: room.id,
        userCreate: other
      });
    });
  };
  const expelMember = () => {
    const userCall = usersSocket.find((user) => user.userId === other.id);
    socketRef.current = socket;
    socketRef.current.emit('expel member', {
      roomId: room.id,
      socketId: userCall.socketId,
      userJoin: other
    });
  };
  const BoxContact = () => (
    <Box
      onClick={user.id !== other.id && room.userCreate.id === user.id && choose}
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        textTransform: 'none',
        background: user.id === other.id ? 'lightgrey' : '#fff',
        alignItems: 'center',
        padding: '0px 5px',
        marginTop: '10px',
        cursor: user.id !== other.id && room.userCreate.id === user.id && 'pointer'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled>
          <Avatar sx={{ width: '30px', height: '30px' }} src={other.avatar}>
            s
          </Avatar>
          <Icon
            style={{
              width: '30px',
              height: '30px',
              position: 'absolute',
              zIndex: 99,
              right: -3,
              bottom: -3,
              color: '#30ab78'
            }}
            icon="ci:dot-02-s"
          />
        </IconButton>
        <Box sx={{ marginLeft: '10px' }}>
          <Username>{other.username}</Username>
          {room.userCreate.id === other.id && (
            <Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>
              Host
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {turnOffAudioRoom.includes(other.id) ? (
          <IconOptions style={{ color: 'red' }} icon="bi:mic-mute-fill" />
        ) : (
          <IconOptions icon="bi:mic-fill" />
        )}
        {turnOffVideoRoom.includes(other.id) ? (
          <IconOptions style={{ color: 'red' }} icon="bi:camera-video-off-fill" />
        ) : (
          <IconOptions style={{ color: 'orange' }} icon="bi:camera-video-fill" />
        )}
        <IconOptions style={{ color: '#000' }} icon="entypo:dots-three-horizontal" />
      </Box>
    </Box>
  );
  return (
    <RootStyle>
      <BoxContact />
      {chooseParticipant.id === other.id && (
        <Box>
          <ListItemButton onClick={cedeHost}>
            <Icon
              style={{ width: '25px', height: '25px', color: 'orange' }}
              icon="ri:exchange-fill"
            />
            <Typography
              sx={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '10px', color: '#000' }}
            >
              Cede host
            </Typography>
          </ListItemButton>
          <ListItemButton onClick={expelMember}>
            <Icon
              style={{ width: '25px', height: '25px', color: 'red' }}
              icon="fluent:sign-out-20-filled"
            />
            <Typography
              sx={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '10px', color: '#000' }}
            >
              Expel member
            </Typography>
          </ListItemButton>
        </Box>
      )}
    </RootStyle>
  );
}

export default Participant;
