import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, InputBase, List, Stack, styled, Typography, Skeleton } from '@mui/material';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'smooth-scrollbar-react';
import { actionGetAllChat } from '../../redux/actions/chatAction';
import { db } from '../../firebase-config';
import UserChat from './UserChat';
import Chatgroup from './Chatgroup';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '450px',
  maxHeight: '100%',
  background: '#fff',
  marginLeft: '10px',
  marginTop: '10px',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100px'
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
const BoxAllChatbox = styled(List)(() => ({
  height: '550px',
  maxHeight: '550px',
  display: 'flex'
}));
function BoxUserChat() {
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  const dispatch = useDispatch();
  const BoxSkeleton = () => (
    <Box sx={{ display: 'flex', marginBottom: '20px' }}>
      <Skeleton sx={{ width: '40px', height: '40px' }} variant="circular" />
      <Box sx={{ marginLeft: '10px' }}>
        <Skeleton
          sx={{ width: '150px', height: '15px', borderRadius: '10px' }}
          variant="rectangular"
        />
        <Box sx={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
          <Skeleton
            sx={{ width: '40px', height: '10px', borderRadius: '10px' }}
            variant="rectangular"
          />
          <Icon icon="ci:dot-01-xs" />
          <Skeleton
            sx={{ width: '30px', height: '10px', borderRadius: '10px' }}
            variant="rectangular"
          />
        </Box>
      </Box>
    </Box>
  );
  return (
    <RootStyle>
      <Title>Chats</Title>
      <BoxSearch>
        <Icon style={{ width: '20px', height: '20px', color: 'grey' }} icon="fe:search" />
        <InputSearch placeholder="Search messenger" />
      </BoxSearch>
      <BoxAllChatbox>
        {chatboxs.length >= 0 ? (
          <Scrollbar alwaysShowTracks>
            {chatboxs.map((item, index) =>
              item.type === 'personal' ? (
                <UserChat home={false} key={index} chatbox={item} />
              ) : (
                <Chatgroup home={false} key={index} chatbox={item} />
              )
            )}
          </Scrollbar>
        ) : (
          <Stack direction="column">
            <BoxSkeleton />
            <BoxSkeleton />
            <BoxSkeleton />
            <BoxSkeleton />
            <BoxSkeleton />
            <BoxSkeleton />
          </Stack>
        )}
      </BoxAllChatbox>
    </RootStyle>
  );
}

export default BoxUserChat;
