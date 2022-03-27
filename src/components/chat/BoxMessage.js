import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Skeleton, Stack, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { actionGetAllMessagesChatbox } from '../../redux/actions/chatAction';
import { actionGetContact } from '../../redux/actions/userAction';
import { db } from '../../firebase-config';
import Message from './Message';

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

function BoxMessage() {
  const user = useSelector((state) => state.user.user);
  const scrollRef = useRef(null);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const dispatch = useDispatch();
  const contact = useSelector((state) => state.user.contact);
  const messages = useSelector((state) => state.chat.messages);
  const [messagesState, setMessagesState] = useState([]);
  const isLoadingMessages = useSelector((state) => state.chat.isLoadingMessages);
  const inputting = useSelector((state) => state.chat.inputting);
  const getAllMessage = () => {
    getDocs(query(collection(db, 'messages'), where('chatboxId', '==', chatbox.id))).then(
      (snapshots) => {
        if (snapshots.empty) {
          setMessagesState([]);
        } else {
          const messages = [];
          snapshots.docs.forEach((message) => {
            messages.push({ ...message.data(), id: message.id });
          });
          const messageSort = messages.sort((a, b) => a.createdAt - b.createdAt);
          setMessagesState(messageSort);
        }
      }
    );
  };
  useEffect(() => {
    if (chatbox.id !== '') {
      dispatch(actionGetContact(user.id, chatbox.user.id));
      dispatch(actionGetAllMessagesChatbox(chatbox.id));
    }
    // if (scrollRef) {
    //   scrollRef.current.addEventListener('DOMNodeInserted', (event) => {
    //     const { currentTarget: target } = event;
    //     target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
    //   });
    // }
    return () => null;
  }, [user, chatbox]);
  // useMemo(() => {
  //   getDocs(query(collection(db, 'messages'), where('chatboxId', '==', chatbox.id))).then(
  //     (snapshots) => {
  //       if (snapshots.empty) {
  //         setMessagesState([]);
  //       } else {
  //         const messages = [];
  //         snapshots.docs.forEach((message) => {
  //           messages.push({ ...message.data(), id: message.id });
  //         });
  //         const messageSort = messages.sort((a, b) => a.createdAt - b.createdAt);
  //         setMessagesState(messageSort);
  //       }
  //     }
  //   );
  // }, [messages]);
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    const ScrollTo = styled('div')(() => ({
      color: '#000'
    }));
    useEffect(() => elementRef.current.scrollIntoView(0, 100), []);
    return <ScrollTo ref={elementRef} />;
  };
  const ContentMessage = () => (
    <Box
      ref={scrollRef}
      sx={{
        display: 'block',
        maxHeight: '100%',
        width: '100%',
        overflowY: 'auto',
        flexGrow: 1
      }}
    >
      {/* <Scrollbar alwaysShowTracks> */}
      <BoxUserEmptyMessage />
      {messages.map((item, index) => (
        <Message key={index} message={item} index={index} />
      ))}
      <AlwaysScrollToBottom />
      {/* </Scrollbar> */}
    </Box>
  );
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
      if (contact.status === 'none') return `You aren't friend on Facebook`;
      if (contact.status === 'friend') return `You're friend on Facebook`;
      if (contact.status === 'sent') return `You sent request for ${chatbox.user.username}`;
      return `${chatbox.user.username} is waiting for your respond`;
    };
    return (
      <BoxUser>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ width: '100px', height: '100px' }} src={chatbox.user.avatar} />
          </Box>
          <Username>{chatbox.user.username}</Username>
          <InfoDetail>ThongIntern</InfoDetail>
          <InfoDetail>{checkContact()}</InfoDetail>
        </Box>
      </BoxUser>
    );
  };
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
  if (chatbox.id === '' || !isLoadingMessages)
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
    <RootStyle>
      <ContentMessage />
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
          <Typography sx={{ fontSize: '13px' }}>{chatbox.user.username} inputting</Typography>
          <Icon style={{ width: '20px', height: '20px' }} icon="eos-icons:three-dots-loading" />
        </Box>
      )}
    </RootStyle>
  );
}

export default BoxMessage;
