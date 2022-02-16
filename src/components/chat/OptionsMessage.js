import React, { useRef, useState } from 'react';
import { Box, Button, Card, IconButton, InputBase, Skeleton, styled } from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { addDoc, collection, doc } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector, useDispatch } from 'react-redux';
import { db, storage } from '../../firebase-config';
import {
  actionGetAllMessagesChatbox,
  actionChatDeleteImageMessage,
  actionChatAddImageMessage
} from '../../redux/actions/chatAction';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  background: '#fff',
  padding: theme.spacing(2, 1, 2),
  margin: `10px 10px 10px 10px`,
  display: 'flex',
  alignItems: 'center',
  maxHeight: '150px'
}));
const IconButtonOption = styled(Box)(({ theme }) => ({
  width: '35px',
  height: '35px',
  borderRadius: '30px',
  marginLeft: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    background: 'lightgrey'
  }
}));
const IconOption = styled(Icon)(({ theme }) => ({
  width: '25px',
  height: '25px',
  color: theme.palette.green
}));
const BoxInput = styled(Box)(({ theme }) => ({
  width: '100%',
  marginLeft: '10px',
  background: theme.palette.background,
  borderRadius: '30px',
  padding: `0px 20px`,
  display: 'flex',
  alignItems: 'center'
}));
const InputMessage = styled(InputBase)(() => ({
  width: '100%',
  display: 'flex',
  maxHeight: '100px'
}));
const WaitChatboxButtonOption = styled(Skeleton)(() => ({
  width: '30px',
  height: '30px',
  marginLeft: '5px'
}));
OptionsMessage.prototype = {
  user: PropTypes.object
};
function OptionsMessage({ user }) {
  const fileRef = useRef(null);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const [isChatting, setIsChatting] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [lineInput, setLineInput] = useState(1);
  const [type, setType] = useState('text');
  const dispatch = useDispatch();
  const inputText = (text) => {
    setMessageText(text);
    if (text !== '') {
      setIsChatting(true);
    } else {
      setIsChatting(false);
    }
  };
  const handleEnterSendMessage = (event) => {
    if (event.key === 'Enter') console.log('ccc');
    if (event.key === 'Enter' && event.shiftKey) console.log('ok');
  };
  const chooseMessage = () => {
    fileRef.current.click();
  };
  const onChangeFile = (files) => {
    if (files && files[0]) {
      if (files[0].size < 5242880) {
        setType('image');
        dispatch(actionChatAddImageMessage(files[0]));
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Image message must less than 5MB',
            type: 'error'
          })
        );
      }
    }
  };
  const sendMessage = () => {
    if (messageText !== '') {
      const message = {
        chatboxId: chatbox.id,
        content: messageText,
        isRead: false,
        type: 'text',
        isRestore: false,
        reaction: [],
        senderId: user.id,
        receiverId: chatbox.user.id,
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message)
        .then(() => {
          dispatch(actionGetAllMessagesChatbox(chatbox.id));
          setMessageText('');
          setIsChatting(false);
          console.log('ok');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  if (chatbox.id === '')
    return (
      <RootStyle>
        <WaitChatboxButtonOption variant="circular" />
        <WaitChatboxButtonOption variant="circular" />
        <WaitChatboxButtonOption variant="circular" />
        <WaitChatboxButtonOption variant="circular" />
        <Skeleton variant="text" sx={{ width: '70%', margin: `0px 5%` }} />
        <WaitChatboxButtonOption variant="circular" />
        <WaitChatboxButtonOption variant="circular" />
      </RootStyle>
    );
  return (
    <RootStyle>
      <IconButtonOption>
        <IconOption icon="bxs:plus-circle" />
      </IconButtonOption>
      <IconButtonOption onClick={chooseMessage}>
        <IconOption icon="gridicons:image-multiple" />
      </IconButtonOption>
      <IconButtonOption>
        <IconOption icon="fluent:sticker-24-filled" />
      </IconButtonOption>
      <IconButtonOption>
        <IconOption icon="mdi:file-gif-box" />
      </IconButtonOption>
      <BoxInput>
        <Scrollbar alwaysShowTracks>
          <InputMessage
            onKeyDown={handleEnterSendMessage}
            value={messageText}
            onChange={(e) => inputText(e.target.value)}
            multiline
            autoFocus
            placeholder="Aa"
          />
        </Scrollbar>
        <IconButtonOption>
          <IconOption icon="carbon:face-satisfied-filled" />
        </IconButtonOption>
      </BoxInput>
      {!isChatting ? (
        <IconButtonOption>
          <IconOption icon="fontisto:like" />
        </IconButtonOption>
      ) : (
        <IconButtonOption>
          <IconOption onClick={sendMessage} icon="teenyicons:send-solid" />
        </IconButtonOption>
      )}
      <input
        onClick={(e) => {
          e.target.value = null;
        }}
        accept=".png, .jpg, .jpeg"
        onChange={(e) => onChangeFile(e.target.files)}
        ref={fileRef}
        style={{ display: 'none' }}
        type="file"
      />
    </RootStyle>
  );
}

export default OptionsMessage;
