import { styled } from '@mui/material';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../firebase-config';
import { actionChatAddMessage, actionGetAllChatSort } from '../../redux/actions/chatAction';

const RootStyle = styled('img')(() => ({
  width: '150px',
  height: '150px',
  cursor: 'pointer'
}));
StickerItem.prototype = {
  user: PropTypes.object,
  url: PropTypes.string,
  close: PropTypes.func
};
function StickerItem({ user, url, close }) {
  const dispatch = useDispatch();
  const chatbox = useSelector((state) => state.chat.chatbox);
  const sendSticker = () => {
    const message = {
      chatboxId: chatbox.id,
      content: '',
      contentFile: url,
      isRead: false,
      isRestore: false,
      reaction: [],
      senderId: user.id,
      type: 'sticker',
      receiverId: chatbox.user.id,
      createdAt: new Date().getTime()
    };
    addDoc(collection(db, 'messages'), message).then((docRef) => {
      close();
      dispatch(actionChatAddMessage(message));
      updateDoc(doc(db, 'chatboxs', chatbox.id), {
        ...chatbox,
        updatedAt: new Date().getTime()
      }).then(() => {
        dispatch(actionGetAllChatSort(user.id));
      });
    });
  };
  return <RootStyle onClick={sendSticker} src={url} alt="sticker" />;
}

export default StickerItem;
