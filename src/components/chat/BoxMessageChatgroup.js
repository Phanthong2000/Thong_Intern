import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Skeleton, styled, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import MessageChatgroup from './MessageChatgroup';
import { actionGetAllMessagesChatbox } from '../../redux/actions/chatAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  background: '#fff',
  maxHeight: '100%',
  height: `100%`,
  marginLeft: '10px',
  marginTop: '10px',
  display: 'block',
  padding: theme.spacing(1, 1, 1)
}));
BoxMessageChatgroup.prototype = {
  user: PropTypes.object
};
function BoxMessageChatgroup({ user }) {
  const inputting = useSelector((state) => state.chat.inputting);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const isLoadingMessages = useSelector((state) => state.chat.isLoadingMessages);
  useEffect(() => {
    if (chatbox.id !== '') {
      dispatch(actionGetAllMessagesChatbox(chatbox.id));
    }
    return () => null;
  }, [user, chatbox]);
  const ContentMessageSkeleton = () => {
    const width = 40 + Math.random() * (200 - 40);
    const widthRound = Math.round(width);
    const BoxSkeleton = styled(Box)(() => ({
      width: '100%',
      display: 'flex',
      marginBottom: '10px',
      justifyContent: widthRound % 2 === 0 ? 'start' : 'end',
      flexDirection: widthRound % 2 === 0 ? 'row' : 'row-reverse'
    }));
    const CircleSkeleton = styled(Skeleton)(() => ({
      width: '30px',
      height: '30px'
    }));
    const MessageSkeleton = styled(Skeleton)(() => ({
      width,
      height: '60px',
      marginLeft: widthRound % 2 === 0 ? '10px' : '0px',
      marginTop: '0px',
      borderRadius: '10px',
      marginRight: '10px'
    }));
    return (
      <Box sx={{ alignItems: 'end' }}>
        <BoxSkeleton>
          <CircleSkeleton variant="circular" />
          <MessageSkeleton variant="rectangular" />
        </BoxSkeleton>
      </Box>
    );
  };
  const gradient = keyframes`
  0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
  `;
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    const ScrollTo = styled('div')(() => ({
      color: '#000'
    }));
    useEffect(() => elementRef.current.scrollIntoView(0, 100), []);
    return <ScrollTo ref={elementRef} />;
  };
  if (!isLoadingMessages)
    return (
      <RootStyle>
        <ContentMessageSkeleton />
        <ContentMessageSkeleton />
        <ContentMessageSkeleton />
        <ContentMessageSkeleton />
        <ContentMessageSkeleton />
        <ContentMessageSkeleton />
        <ContentMessageSkeleton />
      </RootStyle>
    );
  return (
    <RootStyle
      sx={
        chatbox.background === ''
          ? { background: '#fff' }
          : {
              background: chatbox.background,
              animation: `${gradient} 15s ease infinite`,
              backgroundSize: `400% 400%`
            }
      }
    >
      <Box
        sx={{
          display: 'block',
          maxHeight: '100%',
          width: '100%',
          overflowY: 'auto',
          flexGrow: 1
        }}
      >
        {messages.map((item, index) => (
          <MessageChatgroup index={index} key={index} user={user} message={item} />
        ))}
        {inputting.includes(chatbox.id) && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 90,
              display: 'flex',
              alignItems: 'center',
              color: 'gray'
            }}
          >
            <Typography sx={{ fontSize: '13px' }}>other inputting</Typography>
            <Icon style={{ width: '20px', height: '20px' }} icon="eos-icons:three-dots-loading" />
          </Box>
        )}
        <AlwaysScrollToBottom />
      </Box>
    </RootStyle>
  );
}

export default BoxMessageChatgroup;
