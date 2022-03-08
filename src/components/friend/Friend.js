import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, Grid, Skeleton, Stack, styled, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import AvatarMutualFriend from './AvatarMutualFriend';
import { actionChatGetChatbox, actionChatGetChatboxHome } from '../../redux/actions/chatAction';
import { actionUserDeleteFriend } from '../../redux/actions/userAction';

const RootStyle = styled(Grid)(() => ({
  padding: '10px'
}));
const Wrapper = styled(Card)(() => ({
  width: '100%',
  background: '#fff'
}));
const Avatar = styled('img')(() => ({
  width: '100%',
  height: '200px',
  cursor: 'pointer'
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
const ButtonMessage = styled(Button)(({ theme }) => ({
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
Friend.prototype = {
  user: PropTypes.object,
  friend: PropTypes.object,
  index: PropTypes.number
};
function Friend({ user, friend, index }) {
  const [userFriend, setUserFriend] = useState({});
  const navigate = useNavigate();
  const [friendMutualUser, setFriendMutualUser] = useState([]);
  const friendManual = useSelector((state) => state.user.friendManual);
  const [quantityMutualFriend, setQuantityMutualFriend] = useState(-1);
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  const [chatbox, setChatbox] = useState({});
  const friends = useSelector((state) => state.user.friends);
  const dispatch = useDispatch();
  const getAllFriendsSender = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', friend.friendId),
        where('status', '==', true)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', friend.friendId),
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
  const checkExistsChatboxUserAndFriend = (friendId) => {
    chatboxs.forEach((chatbox) => {
      if (
        (chatbox.user1 === user.id && chatbox.user2 === friendId) ||
        (chatbox.user2 === user.id && chatbox.user1 === friendId)
      ) {
        setChatbox(chatbox);
      }
    });
  };
  useEffect(() => {
    getAllFriendsSender();
    getDoc(doc(db, 'users', friend.friendId)).then((snapshot) => {
      setUserFriend({
        ...snapshot.data(),
        id: snapshot.id
      });
      checkExistsChatboxUserAndFriend(snapshot.id);
    });
    return () => null;
  }, [user, friends]);
  const chooseFriend = () => {
    navigate(`/home/other/${friend.friendId}`);
  };
  const chooseChat = () => {
    if (chatbox.id === undefined) {
      dispatch(
        actionChatGetChatboxHome({
          status: true,
          user: userFriend,
          chatbox: {}
        })
      );
      navigate('/home/app');
    } else {
      dispatch(
        actionChatGetChatbox({
          id: chatbox.id,
          user: userFriend
        })
      );
      navigate('/home/chat');
    }
  };
  const unFriend = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', user.id),
        where('receiverId', '==', friend.friendId),
        where('status', '==', true)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', friend.friendId),
        where('receiverId', '==', user.id),
        where('status', '==', true)
      )
    );
    if (!data1.empty) {
      deleteDoc(doc(db, 'contacts', data1.docs.at(0).id)).then(() => {
        dispatch(actionUserDeleteFriend(index));
      });
    }
    if (!data2.empty) {
      deleteDoc(doc(db, 'contacts', data2.docs.at(0).id)).then(() => {
        dispatch(actionUserDeleteFriend(index));
      });
    }
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
        {userFriend.avatar === undefined ? (
          <SkeletonAvatar variant="rectangular" />
        ) : (
          <Avatar onClick={chooseFriend} elevation={3} src={userFriend.avatar} />
        )}
        <WrapperInfo>
          {userFriend.avatar === undefined ? (
            <SkeletonUsername variant="rectangular" />
          ) : (
            <Username>{userFriend.username}</Username>
          )}
          {quantityMutualFriend > -1 ? <ManualFriend /> : <SkeletonMutual variant="rectangular" />}
          <ButtonMessage onClick={chooseChat} startIcon={<Icon icon="bi:chat-left-fill" />}>
            Chat
          </ButtonMessage>
          <ButtonDelete onClick={unFriend} startIcon={<Icon icon="bx:bxs-user-x" />}>
            Unfriend
          </ButtonDelete>
        </WrapperInfo>
      </Wrapper>
    </RootStyle>
  );
}

export default Friend;
