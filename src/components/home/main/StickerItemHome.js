import { styled } from '@mui/material';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../../firebase-config';
import {
  actionChatAddMessage,
  actionChatAddMessageChatboxHome,
  actionGetAllChatSort
} from '../../../redux/actions/chatAction';

const RootStyle = styled('img')(() => ({
  width: '150px',
  height: '150px',
  cursor: 'pointer'
}));
StickerItemHome.prototype = {
  url: PropTypes.string,
  user: PropTypes.object,
  close: PropTypes.func,
  chatbox: PropTypes.object,
  exists: PropTypes.bool,
  other: PropTypes.object,
  chatgroup: PropTypes.object
};
function StickerItemHome({ user, url, close, chatbox, exists, other, chatgroup }) {
  const dispatch = useDispatch();
  const sendSticker = () => {
    if (chatgroup.type === 'group') {
      const message = {
        chatboxId: chatgroup.id,
        content: '',
        contentFile: url,
        isRead: false,
        isRestore: false,
        reaction: [],
        senderId: user.id,
        type: 'sticker',
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message).then((docRef) => {
        dispatch(actionChatAddMessage(message));
        updateDoc(doc(db, 'chatboxs', chatgroup.id), {
          updatedAt: new Date().getTime()
        }).then(() => {
          close();
          dispatch(actionChatAddMessageChatboxHome());
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    } else if (exists) {
      const message = {
        chatboxId: chatbox.id,
        content: '',
        contentFile: url,
        isRead: false,
        isRestore: false,
        reaction: [],
        senderId: user.id,
        type: 'sticker',
        receiverId: other.id,
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message).then((docRef) => {
        dispatch(actionChatAddMessage(message));
        updateDoc(doc(db, 'chatboxs', chatbox.id), {
          updatedAt: new Date().getTime()
        }).then(() => {
          close();
          dispatch(actionChatAddMessageChatboxHome());
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    } else {
      const chatbox = {
        user1: user.id,
        user2: other.id,
        type: 'personal',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      addDoc(collection(db, 'chatboxs'), chatbox).then((docRef) => {
        const message = {
          chatboxId: docRef.id,
          content: '',
          contentFile: url,
          isRead: false,
          isRestore: false,
          reaction: [],
          senderId: user.id,
          type: 'gif',
          receiverId: other.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message).then(() => {
          close();
          dispatch(actionChatAddMessageChatboxHome());
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    }
  };
  return <RootStyle onClick={sendSticker} src={url} alt="sticker" />;
}

export default StickerItemHome;
