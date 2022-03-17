import React, { useEffect, useState } from 'react';
import { Box, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  borderRadius: '10px',
  padding: '5px'
}));
const Title = styled(Typography)(({ theme }) => ({
  color: 'gray',
  fontSize: '12px',
  marginLeft: '5px'
}));
Reply.prototype = {
  user: PropTypes.object,
  message: PropTypes.object
};
function Reply({ user, message }) {
  const [messageReply, setMessageReply] = useState({});
  const [userSent, setUsersent] = useState({});
  const getMessageReply = () => {
    getDoc(doc(db, 'messages', message.messageReply)).then((snapshot) => {
      setMessageReply({
        ...snapshot.data(),
        id: snapshot.id
      });
      getDoc(doc(db, 'users', snapshot.data().senderId)).then((snapshotUser) => {
        setUsersent({
          ...snapshotUser.data(),
          id: snapshotUser.id
        });
      });
    });
  };
  useEffect(() => {
    if (message.messageReply !== undefined) getMessageReply();
    return () => null;
  }, [user]);
  const Content = () => {
    const ContentText = styled(Typography)(({ theme }) => ({
      fontWeight: 'bold',
      fontSize: '13px',
      color: 'gray'
    }));
    const ContentImage = styled('img')(({ theme }) => ({
      width: '50px',
      height: '50px'
    }));
    if (messageReply.type === 'text')
      return <ContentText>{messageReply.content.substring(0, 50)}</ContentText>;
    if (
      messageReply.type === 'image' ||
      messageReply.type === 'gif' ||
      messageReply.type === 'sticker'
    )
      return <ContentImage src={messageReply.contentFile} alt="message" />;
    return <ContentText>Gif</ContentText>;
  };
  const checkReply = () => {
    if (messageReply.senderId === user.id) return `Replied to yourself`;
    if (userSent.username === undefined) return null;
    return `Replied to ${userSent.username}`;
  };
  if (userSent.username === undefined) return null;
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon style={{ color: 'gray', width: '14px', height: '14px' }} icon="bxs:share" />
        <Title>{checkReply()}</Title>
      </Box>
      <Content />
    </RootStyle>
  );
}

export default Reply;
