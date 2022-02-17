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
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionChatClearImageMessage, actionChatGetChatbox } from '../../redux/actions/chatAction';

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
  chatbox: PropTypes.object
};
function UserChat({ chatbox }) {
  const [userChat, setUserChat] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const chatboxChosen = useSelector((state) => state.chat.chatbox);
  const [isLoadingUserChat, setIsLoadingUserChat] = useState(false);
  const dispatch = useDispatch();
  const getUserChat = () => {
    getDoc(doc(db, 'users', chatbox.tempId)).then((snapshot) => {
      setUserChat({
        ...snapshot.data(),
        id: chatbox.tempId
      });
    });
  };
  useEffect(() => {
    getUserChat();
    return () => null;
  }, []);
  const chooseUserChat = () => {
    dispatch(actionChatClearImageMessage());
    dispatch(
      actionChatGetChatbox({
        id: chatbox.id,
        user: userChat
      })
    );
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
          <Typography sx={{ fontSize: '16px', fontFamily: 'inherit', fontWeight: 'bold' }}>
            {userChat.username}
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: 'gray' }}>{checkUserChosen()}</Typography>
            <Icon icon="ci:dot-01-xs" />
            <Typography sx={{ fontSize: '13px', color: 'gray' }}>data</Typography>
          </Stack>
        </BoxInfo>
      </Box>
      {showOptions ? (
        <IconButtonOption>
          <Icon icon="bx:bx-dots-horizontal-rounded" />
        </IconButtonOption>
      ) : null}
    </RootStyle>
  );
}

export default UserChat;
