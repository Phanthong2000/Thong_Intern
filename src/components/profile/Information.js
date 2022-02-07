import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { collection, getDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '60%',
  marginTop: '10px',
  background: '#fff',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center'
  }
}));
const WrapperInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const AvatarUser = styled(IconButton)(() => ({
  width: '20%'
}));
const AvatarImage = styled(Avatar)(() => ({
  width: '100px',
  height: '100px',
  border: '2px solid #30ab78',
  cursor: 'pointer'
}));
const AvatarButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  bottom: '5px',
  right: '5px',
  background: theme.palette.background
}));
const InfoUser = styled(Stack)(({ theme }) => ({
  width: '48%',
  marginLeft: '2%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center'
  }
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '22px',
  fontFamily: 'sans-serif'
}));
const TotalFriend = styled(Typography)(() => ({
  color: 'grey',
  fontSize: '18px',
  fontFamily: 'sans-serif'
}));
Information.prototype = {
  user: PropTypes.object
};
function Information({ user }) {
  const { id } = useParams();
  const [friends1, setFriends1] = useState([]);
  const [friends2, setFriends2] = useState([]);
  const [totalFriends, setTotalFriends] = useState([]);
  useEffect(() => {
    getFriendWhenUserIsReceiver();
    getFriendWhenUserIsSender();
  }, [user]);
  const getFriendWhenUserIsReceiver = () => {
    const data = [];
    getDocs(
      query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
    ).then((snapshots) => {
      snapshots.docs.forEach((contact) => {
        getDoc(doc(db, 'users', contact.data().senderId)).then((snapshot) => {
          data.push({
            ...snapshot.data(),
            id: snapshot.id
          });
          if (snapshots.docs.length === data.length) {
            setFriends1(data);
          }
        });
      });
    });
  };
  const getFriendWhenUserIsSender = () => {
    const data = [];
    getDocs(
      query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
    ).then((snapshots) => {
      snapshots.docs.forEach((contact) => {
        getDoc(doc(db, 'users', contact.data().receiverId)).then((snapshot) => {
          data.push({
            ...snapshot.data(),
            id: snapshot.id
          });
          if (snapshots.docs.length === data.length) {
            setFriends2(data);
          }
        });
      });
    });
  };
  const getTotalFriends = () => {
    const data = [...friends1, ...friends2];
    if (data.length < 2) return `${data.length} Friend`;
    return `${data.length} Friends`;
  };
  return (
    <RootStyle>
      <WrapperInfo>
        <AvatarUser sx={{ '&:hover': { backgroundColor: 'transparent' } }} aria-label="Delete">
          <AvatarImage src={user.avatar} />
          <AvatarButton>
            <Icon
              icon="ic:baseline-photo-camera"
              style={{ color: '#000', width: '20px', height: '20px' }}
            />
          </AvatarButton>
        </AvatarUser>
        <InfoUser>
          <Username>{user.username}</Username>
          <TotalFriend>{getTotalFriends()}</TotalFriend>
        </InfoUser>
      </WrapperInfo>
    </RootStyle>
  );
}

export default Information;
