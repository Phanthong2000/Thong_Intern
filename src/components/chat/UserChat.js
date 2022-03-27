import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  ListItemButton,
  Skeleton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  actionChatClearImageMessage,
  actionChatGetChatbox,
  actionChatGetChatboxHome,
  actionChatReplyMessage,
  actionGetAllBadeMessage
} from '../../redux/actions/chatAction';
import { actionUserCloseMessenger } from '../../redux/actions/userAction';

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 1, 2)
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  marginLeft: '10px',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
const IconButtonOption = styled(IconButton)(({ theme }) => ({
  background: '#fff',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
UserChat.prototype = {
  chatbox: PropTypes.object,
  home: PropTypes.bool
};
function UserChat({ chatbox, home }) {
  const user = useSelector((state) => state.user.user);
  const { pathname } = useLocation();
  const sendMessage = useSelector((state) => state.chat.sendMessage);
  const [userChat, setUserChat] = useState({});
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  const [showOptions, setShowOptions] = useState(false);
  const chatboxChosen = useSelector((state) => state.chat.chatbox);
  const [isLoadingUserChat, setIsLoadingUserChat] = useState(false);
  const [messageLast, setMessageLast] = useState({});
  const badgeMessage = useSelector((state) => state.chat.badgeMessage);
  const dispatch = useDispatch();
  const getUserChat = () => {
    getDoc(doc(db, 'users', chatbox.tempId)).then((snapshot) => {
      setUserChat({
        ...snapshot.data(),
        id: chatbox.tempId
      });
    });
  };
  const getMessagesByChatbox = () => {
    const allMessages = [];
    getDocs(query(collection(db, 'messages'), where('chatboxId', '==', chatbox.id))).then(
      (snapshots) => {
        if (!snapshots.empty) {
          snapshots.docs.forEach((message) => {
            allMessages.push({
              ...message.data(),
              id: message.id
            });
          });
          const allMessagesSort = allMessages.sort((a, b) => a.createdAt - b.createdAt);
          setMessageLast(allMessagesSort.at(allMessagesSort.length - 1));
        } else {
          setMessageLast({});
        }
      }
    );
  };
  useEffect(() => {
    getMessagesByChatbox();
    getUserChat();
    return () => null;
  }, [chatboxs, badgeMessage]);
  const chooseUserChat = () => {
    if (home) {
      if (pathname === '/home/chat') {
        updateDoc(doc(db, 'messages', messageLast.id), { isRead: true }).then(() => {
          setMessageLast({
            ...messageLast,
            isRead: true
          });
          dispatch(actionGetAllBadeMessage(user.id));
        });
        dispatch(actionUserCloseMessenger());
        dispatch(
          actionChatGetChatbox({
            id: chatbox.id,
            user: userChat
          })
        );
      } else {
        updateDoc(doc(db, 'messages', messageLast.id), { isRead: true }).then(() => {
          setMessageLast({
            ...messageLast,
            isRead: true
          });
          dispatch(actionGetAllBadeMessage(user.id));
        });
        dispatch(actionUserCloseMessenger());
        dispatch(
          actionChatGetChatboxHome({
            status: true,
            user: userChat,
            chatbox: {}
          })
        );
      }
    } else {
      if (messageLast.receiverId === user.id) {
        updateDoc(doc(db, 'messages', messageLast.id), { isRead: true }).then(() => {
          setMessageLast({
            ...messageLast,
            isRead: true
          });
          dispatch(actionGetAllBadeMessage(user.id));
        });
      }
      dispatch(actionChatClearImageMessage());
      dispatch(
        actionChatGetChatbox({
          id: chatbox.id,
          user: userChat
        })
      );
    }
    dispatch(actionChatReplyMessage({}));
  };
  const checkUserChosen = () => {
    if (chatbox.id === chatboxChosen.id) return '#ddfc92';
    return '#fff';
  };
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
  if (userChat.id === undefined) {
    return <BoxSkeleton />;
  }
  const checkContentMessage = () => {
    if (messageLast.isRestore) {
      if (messageLast.senderId === user.id) return `You: Unsent a message`;
      return `Unsent a message`;
    }
    if (messageLast.type === 'text') {
      if (messageLast.senderId === user.id) {
        if (messageLast.content.length < 10) return `You: ${messageLast.content}`;
        return `You: ${messageLast.content.substring(0, 10)}...`;
      }
      if (messageLast.content.length < 10) return `${messageLast.content}`;
      return `${messageLast.content.substring(0, 10)}...`;
    }
    if (messageLast.type === 'gif') {
      if (messageLast.senderId === user.id) return `You: sent a gif`;
      return `Sent a gif`;
    }
    if (messageLast.type === 'sticker') {
      if (messageLast.senderId === user.id) return `You: sent a sticker`;
      return `Sent a sticker`;
    }
    if (messageLast.type === 'note') {
      if (messageLast.senderId === user.id) return `You: sent a note`;
      return `Sent a note`;
    }
    if (messageLast.type === 'reply') {
      if (messageLast.senderId === user.id) return `You: replied a message`;
      return `Replied a message`;
    }
    if (messageLast.type === 'call') {
      if (messageLast.senderId === user.id) return `You: started video call`;
      return `Started a message`;
    }
    if (messageLast.senderId === user.id) return `You: sent a image`;
    return `Sent a image`;
  };
  return (
    <RootStyle
      sx={{ background: checkUserChosen() }}
      onClick={chooseUserChat}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <Box sx={{ display: 'flex' }}>
        <Avatar src={userChat.avatar} />
        <BoxInfo>
          {userChat.username === undefined ? (
            <div> ccc</div>
          ) : (
            <Typography sx={{ fontSize: '16px', fontFamily: 'inherit', fontWeight: 'bold' }}>
              {userChat.username}
            </Typography>
          )}
          {messageLast.id === undefined ? null : (
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px', color: 'gray' }}>
                {checkContentMessage()}
              </Typography>
              <Icon icon="ci:dot-01-xs" />
              <Typography sx={{ fontSize: '13px', color: 'gray' }}>
                {new Date().getTime() - messageLast.createdAt >= 259200000
                  ? `${moment(messageLast.createdAt)
                      .fromNow(true)
                      .substring(
                        0,
                        moment(messageLast.createdAt).fromNow(true).indexOf(' ')
                      )}${moment(messageLast.createdAt)
                      .fromNow(true)
                      .substring(
                        moment(messageLast.createdAt).fromNow(true).indexOf(' ') + 1,
                        moment(messageLast.createdAt).fromNow(true).indexOf(' ') + 2
                      )}`
                  : `${moment(messageLast.createdAt).fromNow()}`}
              </Typography>
              {!messageLast.isRead && messageLast.senderId !== user.id && (
                <Icon
                  style={{ color: 'green', width: '20px', height: '20px' }}
                  icon="ci:dot-05-xl"
                />
              )}
            </Stack>
          )}
        </BoxInfo>
      </Box>
      {showOptions && (
        <IconButtonOption>
          <Icon icon="bx:bx-dots-horizontal-rounded" />
        </IconButtonOption>
      )}
    </RootStyle>
  );
}

export default UserChat;
