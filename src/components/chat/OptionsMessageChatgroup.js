import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  InputBase,
  Popover,
  Skeleton,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase-config';
import {
  actionGetAllMessagesChatbox,
  actionChatDeleteImageMessage,
  actionChatAddImageMessage,
  actionChatAddMessage,
  actionChatClearImageMessage,
  actionChatUpdateMessage,
  actionGetAllChat,
  actionGetAllChatSort,
  actionChatInputting,
  actionChatReplyMessage
} from '../../redux/actions/chatAction';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import GifMessage from './Gif';
import StickerMessage from './StickerMessage';
import ReactionMessage from './ReactionMessage';
import {
  sendMessageSocket,
  endCall,
  inputtingSocket,
  deleteInputtingSocketGroup,
  inputtingSocketGroup
} from '../../utils/wssConnection';

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
OptionsMessageChatgroup.prototype = {
  user: PropTypes.object
};
function OptionsMessageChatgroup({ user }) {
  const fileRef = useRef(null);
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const imageMessages = useSelector((state) => state.chat.imageMessages);
  const [isChatting, setIsChatting] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [lineInput, setLineInput] = useState(1);
  const [type, setType] = useState('text');
  const [anchorElGif, setAnchorElGif] = React.useState(null);
  const [anchorElSticker, setAnchorElSticker] = React.useState(null);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const navigate = useNavigate();
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
  const dispatch = useDispatch();
  const reply = useSelector((state) => state.chat.reply);
  useEffect(() => {
    setMessageText('');
    return () => null;
  }, [chatbox, chatboxs]);
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
  const focusMessage = (e) => {
    const socketIds = [];
    chatbox.members.forEach((member) => {
      const userCall = usersSocket.find((user) => user.userId === member);
      if (userCall !== undefined && userCall.userId !== user.id) socketIds.push(userCall.socketId);
    });
    setMessageText(e.target.value);
    if (e.target.value !== '' && e.target.value.length === 1) {
      if (socketIds.length > 0) {
        inputtingSocketGroup({ chatboxId: chatbox.id, socketIds });
      }
    }
    if (e.target.value === '') {
      if (socketIds.length > 0) {
        deleteInputtingSocketGroup({ chatboxId: chatbox.id, socketIds });
      }
    }
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
    if (reply.id !== undefined) {
      const message = {
        chatboxId: chatbox.id,
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
        dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
        updateDoc(doc(db, 'chatboxs', chatbox.id), {
          updatedAt: new Date().getTime()
        }).then((snapshot) => {
          dispatch(actionChatReplyMessage({}));
          setMessageText('');
          setIsChatting(false);
          dispatch(actionGetAllChatSort(user.id));
        });
      });
    } else if (type === 'image' && imageMessages.length > 0) {
      const message = {
        chatboxId: chatbox.id,
        content: messageText,
        contentFile: '',
        isRead: false,
        type: 'image',
        isRestore: false,
        reaction: [],
        senderId: user.id,
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message).then((docRef) => {
        dispatch(actionChatClearImageMessage());
        setMessageText('');
        // dispatch(actionGetAllMessagesChatbox(chatbox.id));
        dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
        const metadata = {
          contentType: 'image/*'
        };
        const storageRef = ref(storage, `messages/${user.id}.${new Date().getTime()}`);
        const uploadTask = uploadBytesResumable(storageRef, imageMessages.at(0), metadata);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            switch (snapshot.state) {
              case 'running':
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              updateDoc(doc(db, 'messages', docRef.id), {
                ...message,
                contentFile: downloadURL
              }).then(() => {
                dispatch(actionChatUpdateMessage({ messageId: docRef.id, image: downloadURL }));
                updateDoc(doc(db, 'chatboxs', chatbox.id), {
                  updatedAt: new Date().getTime()
                }).then(() => {
                  dispatch(actionGetAllChatSort(user.id));
                });
              });
            });
          }
        );
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
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message)
        .then((docRef) => {
          dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
          updateDoc(doc(db, 'chatboxs', chatbox.id), {
            updatedAt: new Date().getTime()
          }).then(() => {
            setMessageText('');
            setIsChatting(false);
            dispatch(actionGetAllChatSort(user.id));
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const sendIconLike = () => {
    const message = {
      chatboxId: chatbox.id,
      content: '',
      contentFile:
        'https://media1.giphy.com/media/pzmePzAZ2iXJKcXAdl/giphy.gif?cid=87370c27o2nk0z4njien0dxyrzsfjss3k1ei8ngfoiojien6&rid=giphy.gif&ct=s',
      isRead: false,
      isRestore: false,
      reaction: [],
      senderId: user.id,
      type: 'sticker',
      createdAt: new Date().getTime()
    };
    addDoc(collection(db, 'messages'), message).then((docRef) => {
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
  };
  const createRoom = () => {
    addDoc(collection(db, 'rooms'), {
      userCreate: user,
      createdAt: new Date().getTime(),
      chatbox,
      status: 'calling',
      members: [user]
    }).then((docRefRoom) => {
      const message = {
        chatboxId: chatbox.id,
        content: `${user.username} created video call room`,
        isRead: false,
        type: 'call',
        isRestore: false,
        reaction: [],
        senderId: user.id,
        createdAt: new Date().getTime(),
        roomId: docRefRoom.id
      };
      addDoc(collection(db, 'messages'), message)
        .then((docRef) => {
          dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
          updateDoc(doc(db, 'chatboxs', chatbox.id), {
            updatedAt: new Date().getTime()
          }).then(() => {
            dispatch(actionGetAllChatSort(user.id));
            navigate(`/home/video-room/${docRefRoom.id}`);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  return (
    <RootStyle>
      <IconButtonOption onClick={createRoom}>
        <IconOption icon="bxs:plus-circle" />
      </IconButtonOption>
      <IconButtonOption onClick={chooseMessage}>
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
        <ReactionMessage type="group" close={handleCloseSticker} user={user} />
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
        <GifMessage type="group" close={handleCloseGif} user={user} />
      </Popover>
      <BoxInput>
        <Scrollbar alwaysShowTracks>
          <InputMessage
            onInput={focusMessage}
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
      {!isChatting && imageMessages.length === 0 ? (
        <IconButtonOption onClick={sendIconLike}>
          <IconOption icon="fontisto:like" />
        </IconButtonOption>
      ) : (
        <IconButtonOption onClick={sendMessage}>
          <IconOption icon="teenyicons:send-solid" />
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

export default OptionsMessageChatgroup;
