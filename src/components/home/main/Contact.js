import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { Avatar, Box, Button, IconButton, Skeleton, styled, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { actionChatGetChatboxHome } from '../../../redux/actions/chatAction';

const RootStyle = styled(Button)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  textTransform: 'none',
  background: theme.palette.background,
  color: theme.palette.green,
  alignItems: 'center',
  padding: '0px'
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
Contact.prototype = {
  user: PropTypes.object,
  otherId: PropTypes.string
};
function Contact({ user, otherId }) {
  const [other, setOther] = useState({});
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const actionGetContact = async (userId, otherId) => {
    const contact1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', otherId),
        where('senderId', '==', userId),
        where('status', '==', true)
      )
    );
    const contact2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', userId),
        where('senderId', '==', otherId),
        where('status', '==', true)
      )
    );
    if (contact1.empty && contact2.empty) {
      setStatus('none');
    } else setStatus('friend');
  };
  useEffect(() => {
    getDoc(doc(db, 'users', otherId)).then((snapshot) => {
      setOther({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
    actionGetContact(user.id, otherId);
    return () => null;
  }, [user]);
  const chooseUserChatboxHome = () => {
    dispatch(
      actionChatGetChatboxHome({
        status: true,
        user: other
      })
    );
  };
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
  if (user.id === otherId) return null;
  if (status === 'none') return null;
  if (other.id === undefined || status === '')
    return (
      <RootStyle>
        <Box sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <SkeletonAvatar variant="circular" />
          <Skeleton sx={{ width: '150px', marginLeft: '10px' }} variant="text" />
        </Box>
      </RootStyle>
    );
  return (
    <RootStyle onClick={chooseUserChatboxHome}>
      <BoxContact />
    </RootStyle>
  );
}

export default Contact;
