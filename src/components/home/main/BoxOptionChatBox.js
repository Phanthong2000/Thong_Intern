import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, InputBase, Popover, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector, useDispatch } from 'react-redux';
import ReactionMessageHome from './ReactionMessageHome';
import GifMessageHome from './GifMessageHome';
import { db } from '../../../firebase-config';
import {
  actionChatAddMessageChatboxHome,
  actionChatReplyMessage,
  actionGetAllChatSort
} from '../../../redux/actions/chatAction';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  height: '60px',
  padding: '5px',
  display: 'flex',
  alignItems: 'center'
}));
const IconButtonOption = styled(Box)(({ theme }) => ({
  width: '30px',
  height: '30px',
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
  width: '20px',
  height: '20px',
  color: theme.palette.green
}));
const BoxInput = styled(Box)(({ theme }) => ({
  width: '70%',
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
BoxOptionChatBox.prototype = {
  user: PropTypes.object,
  other: PropTypes.object,
  chatgroup: PropTypes.object
};
function BoxOptionChatBox({ user, other, chatgroup }) {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [chatbox, setChatbox] = useState({});
  const [isChatting, setIsChatting] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [lineInput, setLineInput] = useState(1);
  const [type, setType] = useState('text');
  const [isExistsChatbox, setIsExistsChatbox] = useState(false);
  const [anchorElGif, setAnchorElGif] = React.useState(null);
  const [anchorElSticker, setAnchorElSticker] = React.useState(null);
  const reply = useSelector((state) => state.chat.reply);
  const handleClickGif = (event) => {
    setAnchorElGif(event.currentTarget);
  };

  const handleCloseGif = () => {
    setAnchorElGif(null);
  };
  const handleClickSticker = (event) => {
    setAnchorElSticker(event.currentTarget);
  };

  const handleCloseSticker = () => {
    setAnchorElSticker(null);
  };
  const openGif = Boolean(anchorElGif);
  const openGSticker = Boolean(anchorElSticker);
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const checkIsExistsChatbox = async () => {
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
      setIsExistsChatbox(false);
    } else {
      if (!data1.empty) {
        setChatbox({
          ...data1.docs.at(0).data(),
          id: data1.docs.at(0).id
        });
      } else {
        setChatbox({
          ...data2.docs.at(0).data(),
          id: data2.docs.at(0).id
        });
      }
      setIsExistsChatbox(true);
    }
  };
  useEffect(() => {
    checkIsExistsChatbox();
    return () => null;
  }, [chatboxHome]);
  const inputMessage = (e) => {
    const text = e.target.value;
    setMessageText(text);
    if (text === '') {
      setIsChatting(false);
    } else {
      setIsChatting(true);
    }
  };
  const sendMessage = () => {
    if (chatgroup.type === 'group') {
      if (reply.id !== undefined) {
        const message = {
          chatboxId: chatgroup.id,
          content: messageText,
          isRead: false,
          type: 'reply',
          isRestore: false,
          messageReply: reply.id,
          reaction: [],
          senderId: user.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message).then((docRef) => {
          dispatch(actionChatAddMessageChatboxHome());
          updateDoc(doc(db, 'chatboxs', chatgroup.id), {
            updatedAt: new Date().getTime()
          }).then((snapshot) => {
            dispatch(actionChatReplyMessage({}));
            setMessageText('');
            setIsChatting(false);
            dispatch(actionGetAllChatSort(user.id));
          });
        });
      } else {
        const message = {
          chatboxId: chatgroup.id,
          content: messageText,
          isRead: false,
          type: 'text',
          isRestore: false,
          reaction: [],
          senderId: user.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message)
          .then((docRef) => {
            console.log(docRef.id);
            updateDoc(doc(db, 'chatboxs', chatgroup.id), {
              updatedAt: new Date().getTime()
            }).then(() => {
              setMessageText('');
              setIsChatting(false);
              dispatch(actionChatAddMessageChatboxHome());
              dispatch(actionGetAllChatSort(user.id));
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (!isExistsChatbox) {
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
          content: messageText,
          isRead: false,
          type: 'text',
          isRestore: false,
          reaction: [],
          senderId: user.id,
          receiverId: chatboxHome.user.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message).then((docRef) => {
          setMessageText('');
          setIsChatting(false);
          dispatch(actionChatAddMessageChatboxHome());
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    } else if (reply.id !== undefined) {
      const message = {
        chatboxId: chatbox.id,
        content: messageText,
        isRead: false,
        type: 'reply',
        isRestore: false,
        messageReply: reply.id,
        reaction: [],
        senderId: user.id,
        receiverId: chatboxHome.user.id,
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message).then((docRef) => {
        dispatch(actionChatAddMessageChatboxHome());
        updateDoc(doc(db, 'chatboxs', chatbox.id), {
          updatedAt: new Date().getTime()
        }).then((snapshot) => {
          dispatch(actionChatReplyMessage({}));
          setMessageText('');
          setIsChatting(false);
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    } else {
      const message = {
        chatboxId: chatbox.id,
        content: messageText,
        isRead: false,
        type: 'text',
        isRestore: false,
        reaction: [],
        senderId: user.id,
        receiverId: chatboxHome.user.id,
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message)
        .then((docRef) => {
          console.log(docRef.id);
          updateDoc(doc(db, 'chatboxs', chatbox.id), {
            updatedAt: new Date().getTime()
          }).then(() => {
            setMessageText('');
            setIsChatting(false);
            dispatch(actionChatAddMessageChatboxHome());
            dispatch(actionGetAllChatSort(user.id));
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <RootStyle>
      <IconButtonOption>
        <IconOption icon="bxs:plus-circle" />
      </IconButtonOption>
      <IconButtonOption>
        <IconOption icon="gridicons:image-multiple" />
      </IconButtonOption>
      <IconButtonOption onClick={handleClickSticker}>
        <IconOption icon="fluent:sticker-24-filled" />
      </IconButtonOption>
      <Popover
        id="simple-popover"
        open={openGSticker}
        anchorEl={anchorElSticker}
        onClose={handleCloseSticker}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <ReactionMessageHome
          close={handleCloseSticker}
          exists={isExistsChatbox}
          chatbox={chatbox}
          other={other}
          user={user}
          chatgroup={chatgroup}
        />
      </Popover>
      <IconButtonOption onClick={handleClickGif}>
        <IconOption icon="mdi:file-gif-box" />
      </IconButtonOption>
      <Popover
        id="simple-popover"
        open={openGif}
        anchorEl={anchorElGif}
        onClose={handleCloseGif}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <GifMessageHome
          close={handleCloseGif}
          exists={isExistsChatbox}
          chatbox={chatbox}
          other={other}
          user={user}
          chatgroup={chatgroup}
        />
      </Popover>
      <BoxInput>
        <Scrollbar alwaysShowTracks>
          <InputMessage
            value={messageText}
            onChange={inputMessage}
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
        <IconButtonOption onClick={sendMessage}>
          <IconOption icon="teenyicons:send-solid" />
        </IconButtonOption>
      )}
    </RootStyle>
  );
}

export default BoxOptionChatBox;
