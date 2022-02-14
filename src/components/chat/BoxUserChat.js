import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, InputBase, Stack, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { actionChatGetAllChat } from '../../redux/actions/chatAction';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '400px',
  maxHeight: '100%',
  background: '#fff',
  marginLeft: '50px',
  marginTop: '10px',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0
  }
}));
const Title = styled(Typography)(() => ({
  fontFamily: 'inherit',
  fontWeight: 'bold',
  fontSize: '20px'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  padding: theme.spacing(0.5, 1, 0.5),
  margin: theme.spacing(1, 0, 1),
  display: 'flex',
  alignItems: 'center',
  borderRadius: '20px'
}));
const InputSearch = styled(InputBase)(() => ({
  width: '90%',
  marginLeft: '5px'
}));
BoxUserChat.prototype = {
  user: PropTypes.object
};
function BoxUserChat({ user }) {
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  const dispatch = useDispatch();
  const getAllChat = async () => {
    const data1 = await getDocs(query(collection(db, 'chatboxs'), where('user1', '==', user.id)));
    const data2 = await getDocs(query(collection(db, 'chatboxs'), where('user2', '==', user.id)));
    if (data2.empty) {
      console.log('empty');
    } else {
      console.log(data2.size);
    }
  };
  useEffect(() => {
    getAllChat();
    return () => null;
  }, [user]);
  return (
    <RootStyle>
      <Title>Chats</Title>
      <BoxSearch>
        <Icon style={{ width: '20px', height: '20px', color: 'grey' }} icon="fe:search" />
        <InputSearch placeholder="Search messenger" />
      </BoxSearch>
    </RootStyle>
  );
}

export default BoxUserChat;
