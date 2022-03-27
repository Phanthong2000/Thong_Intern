import React, { useEffect, useState } from 'react';
import { Box, Card, IconButton, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { doc, getDoc } from 'firebase/firestore';
import { actionChatReplyMessage } from '../../redux/actions/chatAction';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 1, 1),
  marginLeft: '10px',
  background: '#fff',
  marginTop: '10px',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'auto',
  maxHeight: '100px'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '14px',
  color: 'gray'
}));
function BoxReply() {
  const user = useSelector((state) => state.user.user);
  const reply = useSelector((state) => state.chat.reply);
  const dispatch = useDispatch();
  const [userSent, setUserSent] = useState({});
  const getUserSender = (id) => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      setUserSent({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    if (user.id !== reply.senderId) {
      getUserSender(reply.senderId);
    }
    return () => {
      // dispatch(actionChatReplyMessage({}));
    };
  }, [user, reply]);
  const close = () => {
    dispatch(actionChatReplyMessage({}));
  };
  const checkReply = () => {
    if (reply.senderId === user.id) return `Replying to yourself`;
    if (userSent.username === undefined) return null;
    return `Replying to ${userSent.username}`;
  };
  const Content = () => {
    const ContentText = styled(Typography)(({ theme }) => ({
      fontWeight: 'bold',
      fontSize: '13px'
    }));
    const ContentImage = styled('img')(({ theme }) => ({
      width: '50px',
      height: '50px'
    }));
    if (reply.type === 'text') return <ContentText>{reply.content}</ContentText>;
    if (reply.type === 'image' || reply.type === 'gif' || reply.type === 'sticker')
      return <ContentImage src={reply.contentFile} alt="message" />;
    return <ContentText>Gif</ContentText>;
  };
  return (
    <RootStyle>
      <Box>
        <Title>{checkReply()}</Title>
        <Content />
      </Box>
      <IconButton onClick={close}>
        <Icon icon="ep:close-bold" />
      </IconButton>
    </RootStyle>
  );
}

export default BoxReply;
