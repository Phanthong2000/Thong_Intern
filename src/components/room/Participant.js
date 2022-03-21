import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { Avatar, Box, Button, IconButton, Skeleton, styled, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionChooseParticipant } from '../../redux/actions/callAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  background: '#fff',
  color: theme.palette.green,
  padding: '0px 5px',
  marginTop: '10px'
}));
const Username = styled(Typography)(() => ({
  marginLeft: '10px',
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
  const chooseParticipant = useSelector((state) => state.call.chooseParticipant);
  const dispatch = useDispatch();
  const choose = () => {
    if (chooseParticipant.id === other.id) dispatch(actionChooseParticipant({}));
    else dispatch(actionChooseParticipant(other));
  };
  const BoxContact = () => (
    <Box
      onClick={user.id !== other.id && room.userCreate.id === user.id && choose}
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        textTransform: 'none',
        background: 'lightgrey',
        alignItems: 'center',
        padding: '0px 5px',
        marginTop: '10px',
        cursor: user.id !== other.id && room.userCreate.id === user.id && 'pointer'
      }}
    >
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
      <Username>{other.username}</Username>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconOptions icon="bi:mic-fill" />
        <IconOptions style={{ color: 'orange' }} icon="bi:camera-video-fill" />
        <IconOptions style={{ color: '#000' }} icon="entypo:dots-three-horizontal" />
      </Box>
    </Box>
  );
  return (
    <RootStyle>
      <BoxContact />
      {chooseParticipant.id === other.id && <Typography>ok</Typography>}
    </RootStyle>
  );
}

export default Participant;
