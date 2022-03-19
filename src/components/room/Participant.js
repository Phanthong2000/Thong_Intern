import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { Avatar, Box, Button, IconButton, Skeleton, styled, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  textTransform: 'none',
  background: theme.palette.background,
  color: theme.palette.green,
  alignItems: 'center',
  padding: '0px',
  marginTop: '10px'
}));
const Username = styled(Typography)(() => ({
  marginLeft: '10px',
  fontWeight: 'bold',
  fontFamily: 'inherit',
  color: '#000',
  fontSize: '17px'
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '40px',
  height: '40px'
}));
Participant.prototype = {
  otherId: PropTypes.string
};
function Participant({ otherId }) {
  const [other, setOther] = useState({});
  const participants = useSelector((state) => state.call.participants);
  useEffect(() => {
    if (otherId !== undefined) {
      getDoc(doc(db, 'users', otherId)).then((snapshot) => {
        setOther({
          ...snapshot.data(),
          id: snapshot.id
        });
      });
    }
    return () => null;
  }, [participants]);
  const BoxContact = () => (
    <>
      <IconButton disabled>
        <Avatar sx={{ width: '40px', height: '40px' }} src={other.avatar}>
          s
        </Avatar>
        <Icon
          style={{
            width: '40px',
            height: '40px',
            position: 'absolute',
            zIndex: 99,
            right: -7,
            bottom: -7,
            color: '#30ab78'
          }}
          icon="ci:dot-02-s"
        />
      </IconButton>
      <Username>{other.username}</Username>
    </>
  );
  if (other.id === undefined)
    return (
      <RootStyle>
        <Box sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <SkeletonAvatar variant="circular" />
          <Skeleton sx={{ width: '150px', marginLeft: '10px' }} variant="text" />
        </Box>
      </RootStyle>
    );
  return (
    <RootStyle>
      <BoxContact />
    </RootStyle>
  );
}

export default Participant;
