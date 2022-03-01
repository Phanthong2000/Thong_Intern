import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Box, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';
import { db } from '../../../firebase-config';
import Message from '../../chat/Message';
import MessageChatgroup from '../../chat/MessageChatgroup';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  height: '330px',
  maxHeight: '330px',
  display: 'block',
  overflowY: 'auto',
  flexGrow: 1,
  padding: '5px'
}));
BoxMessageChatBox.prototype = {
  user: PropTypes.object,
  other: PropTypes.object,
  chatbox: PropTypes.object
};
function BoxMessageChatBox({ user, other, chatbox }) {
  const [allMessages, setAllMessages] = useState([]);
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const addMessageChatboxHome = useSelector((state) => state.chat.addMessageChatboxHome);
  const [status, setStatus] = useState('');
  const actionGetContact = async (userId, otherId) => {
    const contact1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', otherId),
        where('senderId', '==', userId)
      )
    );
    const contact2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', userId),
        where('senderId', '==', otherId)
      )
    );
    if (contact1.empty && contact2.empty) {
      setStatus('none');
      return;
    }
    if (!contact1.empty) {
      if (contact1.docs.at(0).data().status) {
        setStatus('friend');
        return;
      }
      setStatus('sent');
      return;
    }
    if (!contact2.empty) {
      if (contact2.docs.at(0).data().status) {
        setStatus('friend');
        return;
      }
      setStatus('received');
    }
  };
  const getAllMessage = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'chatboxs'),
        where('user1', '==', user.id),
        where('user2', '==', other.id)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'chatboxs'),
        where('user1', '==', other.id),
        where('user2', '==', user.id)
      )
    );
    if (data1.empty && data2.empty) {
      setAllMessages([]);
      return;
    }
    if (!data1.empty) {
      const chatbox = {
        ...data1.docs.at(0).data(),
        id: data1.docs.at(0).id
      };
      getDocs(query(collection(db, 'messages'), where('chatboxId', '==', chatbox.id))).then(
        (snapshots) => {
          if (snapshots.empty) {
            setAllMessages([]);
          } else {
            const messages = [];
            snapshots.docs.forEach((message) => {
              messages.push({ ...message.data(), id: message.id });
            });
            const messageSort = messages.sort((a, b) => a.createdAt - b.createdAt);
            setAllMessages(messageSort);
          }
        }
      );
    } else {
      const chatbox = {
        ...data2.docs.at(0).data(),
        id: data2.docs.at(0).id
      };
      getDocs(query(collection(db, 'messages'), where('chatboxId', '==', chatbox.id))).then(
        (snapshots) => {
          if (snapshots.empty) {
            setAllMessages([]);
          } else {
            const messages = [];
            snapshots.docs.forEach((message) => {
              messages.push({ ...message.data(), id: message.id });
            });
            const messageSort = messages.sort((a, b) => a.createdAt - b.createdAt);
            setAllMessages(messageSort);
          }
        }
      );
    }
  };
  const getAllMessageChatgroup = async () => {
    const data = await getDocs(
      query(collection(db, 'messages'), where('chatboxId', '==', chatbox.id))
    );
    if (data.empty) {
      setAllMessages([]);
    } else {
      const messages = [];
      data.docs.forEach((message) => {
        messages.push({
          ...message.data(),
          id: message.id
        });
      });
      const messagesSort = messages.sort((a, b) => a.createdAt - b.createdAt);
      setAllMessages(messagesSort);
    }
  };
  useEffect(() => {
    if (chatbox.type === 'group') getAllMessageChatgroup();
    else getAllMessage();
    return () => null;
  }, [chatboxHome, addMessageChatboxHome]);
  useEffect(() => {
    actionGetContact(user.id, other.id);
    return () => null;
  }, []);
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    const ScrollTo = styled('div')(() => ({
      color: '#000'
    }));
    useEffect(() => elementRef.current.scrollIntoView(0, 100), []);
    return <ScrollTo ref={elementRef} />;
  };
  const BoxUserEmptyMessage = () => {
    const BoxUser = styled(Box)(() => ({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: '50px'
    }));
    const Username = styled(Typography)(() => ({
      fontWeight: 'bold',
      fontFamily: 'inherit',
      fontSize: '22px',
      marginTop: '10px'
    }));
    const InfoDetail = styled(Typography)(() => ({
      color: 'gray',
      fontSize: '14px'
    }));
    const checkContact = () => {
      if (status === '') return null;
      if (status === 'none') return `You aren't friend on Facebook`;
      if (status === 'friend') return `You're friend on Facebook`;
      if (status === 'sent') return `You sent request for ${other.username}`;
      return `${other.username} is waiting for your respond`;
    };
    return (
      <BoxUser>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ width: '100px', height: '100px' }} src={chatboxHome.user.avatar} />
          </Box>
          <Username>{chatboxHome.user.username}</Username>
          <InfoDetail>ThongIntern</InfoDetail>
          <InfoDetail>{checkContact()}</InfoDetail>
        </Box>
      </BoxUser>
    );
  };
  if (chatbox.type === 'group')
    return (
      <RootStyle>
        {allMessages.map((item, index) => (
          <Message key={index} user={user} message={item} index={index} />
        ))}
        <AlwaysScrollToBottom />
      </RootStyle>
    );
  return (
    <RootStyle>
      <BoxUserEmptyMessage />
      {allMessages.map((item, index) => (
        <Message key={index} user={user} message={item} index={index} />
      ))}
      <AlwaysScrollToBottom />
    </RootStyle>
  );
}

export default BoxMessageChatBox;
