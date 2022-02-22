import { styled } from '@mui/material';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionChatAddMessage, actionGetAllChatSort } from '../../redux/actions/chatAction';
import { db } from '../../firebase-config';
import { sendMessageSocket } from '../../utils/wssConnection';

const RootStyle = styled('img')(() => ({
  width: '150px',
  height: '150px',
  cursor: 'pointer'
}));
GifItem.prototype = {
  user: PropTypes.object,
  url: PropTypes.string,
  close: PropTypes.func,
  type: PropTypes.string
};
function GifItem({ user, url, close, type }) {
  const chatbox = useSelector((state) => state.chat.chatbox);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const dispatch = useDispatch();
  const sendGif = () => {
    if (type === 'group') {
      const message = {
        chatboxId: chatbox.id,
        content: '',
        contentFile: url,
        isRead: false,
        isRestore: false,
        reaction: [],
        senderId: user.id,
        type: 'gif',
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message).then((docRef) => {
        close();
        dispatch(
          actionChatAddMessage({
            ...message,
            id: docRef.id
          })
        );
        updateDoc(doc(db, 'chatboxs', chatbox.id), {
          ...chatbox,
          updatedAt: new Date().getTime()
        }).then(() => {
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    } else {
      const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
      if (userCall === undefined) {
        const message = {
          chatboxId: chatbox.id,
          content: '',
          contentFile: url,
          isRead: false,
          isRestore: false,
          reaction: [],
          senderId: user.id,
          type: 'gif',
          receiverId: chatbox.user.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message).then((docRef) => {
          close();
          dispatch(
            actionChatAddMessage({
              ...message,
              id: docRef.id
            })
          );
          updateDoc(doc(db, 'chatboxs', chatbox.id), {
            ...chatbox,
            updatedAt: new Date().getTime()
          }).then(() => {
            dispatch(actionGetAllChatSort(user.id));
          });
        });
      } else {
        const message = {
          chatboxId: chatbox.id,
          content: '',
          contentFile: url,
          isRead: false,
          isRestore: false,
          reaction: [],
          senderId: user.id,
          type: 'gif',
          receiverId: chatbox.user.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message).then((docRef) => {
          close();
          dispatch(
            actionChatAddMessage({
              ...message,
              id: docRef.id
            })
          );
          updateDoc(doc(db, 'chatboxs', chatbox.id), {
            ...chatbox,
            updatedAt: new Date().getTime()
          }).then(() => {
            sendMessageSocket({
              ...message,
              socketId: userCall.socketId
            });
            dispatch(actionGetAllChatSort(user.id));
          });
        });
      }
    }
  };
  return <RootStyle onClick={sendGif} src={url} alt="gif" />;
}

export default GifItem;
