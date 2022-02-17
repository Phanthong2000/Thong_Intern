import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, Grid, Skeleton, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionUserDeleteFriendRequest } from '../../redux/actions/userAction';
import AvatarMutualFriend from './AvatarMutualFriend';

const RootStyle = styled(Grid)(() => ({
  padding: '10px'
}));
const Wrapper = styled(Card)(() => ({
  width: '100%',
  background: '#fff',
  cursor: 'pointer'
}));
const Avatar = styled('img')(() => ({
  width: '100%',
  height: '200px'
}));
const WrapperInfo = styled(Stack)(() => ({
  width: '100%',
  padding: `10px`
}));
const Username = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  fontFamily: 'inherit',
  [theme.breakpoints.up('lg')]: {
    fontSize: '16px'
  }
}));
const ButtonConfirm = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  color: '#fff',
  background: theme.palette.green,
  marginTop: '10px',
  fontSize: '16px',
  fontFamily: 'serif',
  fontWeight: 'bold',
  ':hover': {
    background: theme.palette.green
  }
}));
const ButtonDelete = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  color: '#000',
  background: theme.palette.background,
  marginTop: '10px',
  fontSize: '16px',
  fontFamily: 'serif',
  fontWeight: 'bold',
  ':hover': {
    background: theme.palette.background
  }
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '100%',
  height: '200px'
}));
const SkeletonUsername = styled(Skeleton)(() => ({
  width: '100%',
  height: 24,
  borderRadius: '20px'
}));
const SkeletonMutual = styled(Skeleton)(() => ({
  width: '100%',
  height: '14px',
  borderRadius: '20px',
  marginTop: '10px'
}));
Request.prototype = {
  user: PropTypes.object,
  contact: PropTypes.object,
  index: PropTypes.number
};
function Request({ user, contact, index }) {
  const [userSent, setUserSent] = useState({});
  const navigate = useNavigate();
  const friendManual = useSelector((state) => state.user.friendManual);
  const [quantityMutualFriend, setQuantityMutualFriend] = useState(-1);
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const [friendMutualUser, setFriendMutualUser] = useState([]);
  const dispatch = useDispatch();
  const getAllFriendsSender = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', contact.senderId),
        where('status', '==', true)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', contact.senderId),
        where('status', '==', true)
      )
    );
    if (data1.empty && data2.empty) {
      setQuantityMutualFriend(0);
    }
    const contacts = [];
    data1.docs.forEach((contact) => {
      contacts.push(contact.data().receiverId);
    });
    data2.docs.forEach((contact) => {
      contacts.push(contact.data().senderId);
    });
    const temp = [];
    if (friendManual.length >= contacts.length) {
      contacts.forEach((friend) => {
        if (friendManual.includes(friend)) {
          temp.push(friend);
        }
      });
    } else {
      friendManual.forEach((friend) => {
        if (contacts.includes(friend)) {
          temp.push(friend);
        }
      });
    }
    setQuantityMutualFriend(temp.length);
    setFriendMutualUser(temp);
  };
  useEffect(() => {
    getAllFriendsSender();
    getDoc(doc(db, 'users', contact.senderId)).then((snapshot) => {
      setUserSent({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  }, [user, friendManual, friendRequests]);
  const chooseRequest = () => {
    navigate(`/home/other/${userSent.id}`);
  };
  const confirmRequest = () => {
    console.log(contact.id);
    updateDoc(doc(db, 'contacts', contact.id), {
      status: true
    })
      .then(() => {
        dispatch(actionUserDeleteFriendRequest(contact.id));
      })
      .catch((error) => console.log(error));
  };
  const deleteRequest = () => {
    console.log(contact.id);
    deleteDoc(doc(db, 'contacts', contact.id)).then(() => {
      dispatch(actionUserDeleteFriendRequest(contact.id));
    });
  };
  const ManualFriend = () => {
    const Mutual = styled(Typography)(() => ({
      minHeight: '24px',
      fontFamily: 'inherit',
      color: 'gray',
      marginLeft: '10px'
    }));
    if (quantityMutualFriend === 0) return <Mutual> </Mutual>;
    if (quantityMutualFriend === 1)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AvatarMutualFriend mutualFriendId={friendMutualUser.at(0)} />
          <Mutual>1 manual friend</Mutual>
        </Box>
      );
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '7px' }}>
        <AvatarMutualFriend zIndex={1} margin={0} mutualFriendId={friendMutualUser.at(0)} />
        <AvatarMutualFriend zIndex={2} margin={-1} mutualFriendId={friendMutualUser.at(1)} />
        <Mutual>{`${quantityMutualFriend} manual friend`}</Mutual>
      </Box>
    );
  };
  return (
    <RootStyle item xs={12} sm={8} md={6} lg={5} xl={3}>
      <Wrapper>
        {userSent.avatar === undefined ? (
          <SkeletonAvatar variant="rectangular" />
        ) : (
          <Avatar onClick={chooseRequest} elevation={3} src={userSent.avatar} />
        )}
        <WrapperInfo>
          {userSent.avatar === undefined ? (
            <SkeletonUsername variant="rectangular" />
          ) : (
            <Username>{userSent.username}</Username>
          )}
          {quantityMutualFriend > -1 ? <ManualFriend /> : <SkeletonMutual variant="rectangular" />}
          <ButtonConfirm onClick={confirmRequest}>Confirm</ButtonConfirm>
          <ButtonDelete onClick={deleteRequest}>Delete</ButtonDelete>
        </WrapperInfo>
      </Wrapper>
    </RootStyle>
  );
}

export default Request;
