import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, Popover, Skeleton, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionChatDeleteMessage, actionChatReplyMessage } from '../../redux/actions/chatAction';
import ReplyOther from './ReplyOther';
import Reply from './Reply';

const BoxMessageUserSender = styled(Box)(() => ({
  width: '100%',
  justifyContent: 'end',
  marginBottom: '10px',
  display: 'flex'
}));
const BoxMessageOtherUserSender = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
  marginBottom: '10px'
}));
const AvatarUserSent = styled(Avatar)(() => ({
  width: '35px',
  height: '35px'
}));
const BoxContentMessage = styled(Box)(({ theme }) => ({
  marginLeft: '10px',
  heigh: '200px',
  background: theme.palette.background,
  padding: theme.spacing(1, 1, 1),
  borderRadius: '10px',
  maxWidth: '80%'
}));
const BoxOptionUser = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center'
}));
const ButtonOptionUser = styled(Box)(() => ({
  borderRadius: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  width: '25px',
  height: '25px',
  marginRight: '5px',
  cursor: 'pointer',
  ':hover': {
    background: 'lightgray'
  }
}));
const BoxOptionOther = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center'
}));
const ButtonOptionOther = styled(Box)(() => ({
  borderRadius: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  width: '25px',
  height: '25px',
  marginLeft: '5px',
  cursor: 'pointer',
  ':hover': {
    background: 'lightgray'
  }
}));
MessageChatgroup.prototype = {
  user: PropTypes.object,
  message: PropTypes.object,
  index: PropTypes.number
};
function MessageChatgroup({ user, message, index }) {
  const contentRef = useRef(null);
  const [nameReactChosen, setNameReactChosen] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const chatbox = useSelector((state) => state.chat.chatbox);
  const [reaction, setReaction] = useState(message.reaction);
  const [isRestore, setIsRestore] = useState(message.isRestore);
  const [showOptions, setShowOptions] = useState(false);
  const [userSent, setUserSent] = useState({});
  const [anchorElReaction, setAnchorElReaction] = React.useState(null);
  const [anchorElDelete, setAnchorElDelete] = React.useState(null);
  const [heightContentText, setHeightContentText] = useState(0);
  const openReact = Boolean(anchorElReaction);
  const openDelete = Boolean(anchorElDelete);
  const dispatch = useDispatch();
  const updateMessage = useSelector((state) => state.chat.updateMessage);
  const handleClickReaction = (event) => {
    setAnchorElReaction(event.currentTarget);
  };
  const handleCloseReaction = () => {
    setAnchorElReaction(null);
    setShowOptions(false);
  };
  const handleClickDelete = (event) => {
    setAnchorElDelete(event.currentTarget);
  };
  const handleCloseDelete = () => {
    setAnchorElDelete(null);
    setShowOptions(false);
  };
  const mouseEnterMessage = () => {
    setShowOptions(true);
  };
  const mouseLeaveMessage = () => {
    setShowOptions(false);
  };
  const getUserSent = () => {
    getDoc(doc(db, 'users', message.senderId)).then((snapshot) => {
      setUserSent({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getUserSent();
    if (contentRef.current !== null) {
      setHeightContentText(contentRef.current.clientHeight);
    }
    if (reaction.find((item) => item.userId === user.id) === undefined) {
      setNameReactChosen('');
    } else {
      setNameReactChosen(reaction.find((item) => item.userId === user.id).react);
    }
    return () => null;
  }, [user]);
  useEffect(() => {
    getUserSent();
    if (message.type === 'image') setImageMessage(message.contentFile);
    if (updateMessage.messageId === message.id) {
      setImageMessage(updateMessage.image);
    }
    return () => null;
  }, [updateMessage]);

  const BoxChooseReaction = ({ click, icon, isChosen }) => {
    const BoxChoose = styled(Box)(() => ({
      width: '35px',
      height: '35px',
      borderRadius: '50px',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      cursor: 'pointer',
      ':hover': {
        background: 'lightgray'
      }
    }));
    return (
      <BoxChoose sx={{ background: isChosen ? 'gray' : '#fff' }}>
        <Icon
          onClick={click}
          style={{
            width: '30px',
            height: '30px',
            color: icon === 'ant-design:like-filled' ? 'blue' : null
          }}
          icon={icon}
        />
      </BoxChoose>
    );
  };
  const likeMessage = () => {
    if (nameReactChosen === 'like') {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction(reactionNew);
      setNameReactChosen('');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: reactionNew
      });
    } else {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction([...reactionNew, { react: 'like', userId: user.id }]);
      setNameReactChosen('like');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: [...reactionNew, { react: 'like', userId: user.id }]
      });
    }
  };
  const loveMessage = () => {
    if (nameReactChosen === 'love') {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction(reactionNew);
      setNameReactChosen('');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: reactionNew
      });
    } else {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction([...reactionNew, { react: 'love', userId: user.id }]);
      setNameReactChosen('love');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: [...reactionNew, { react: 'love', userId: user.id }]
      });
    }
  };
  const smileMessage = () => {
    if (nameReactChosen === 'smile') {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction(reactionNew);
      setNameReactChosen('');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: reactionNew
      });
    } else {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction([...reactionNew, { react: 'smile', userId: user.id }]);
      setNameReactChosen('smile');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: [...reactionNew, { react: 'smile', userId: user.id }]
      });
    }
  };
  const wowMessage = () => {
    if (nameReactChosen === 'wow') {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction(reactionNew);
      setNameReactChosen('');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: reactionNew
      });
    } else {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction([...reactionNew, { react: 'wow', userId: user.id }]);
      setNameReactChosen('wow');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: [...reactionNew, { react: 'wow', userId: user.id }]
      });
    }
  };
  const cryMessage = () => {
    if (nameReactChosen === 'cry') {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction(reactionNew);
      setNameReactChosen('');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: reactionNew
      });
    } else {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction([...reactionNew, { react: 'cry', userId: user.id }]);
      setNameReactChosen('cry');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: [...reactionNew, { react: 'cry', userId: user.id }]
      });
    }
  };
  const angryMessage = () => {
    if (nameReactChosen === 'angry') {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction(reactionNew);
      setNameReactChosen('');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: reactionNew
      });
    } else {
      const reactionNew = reaction.filter((item) => item.userId !== user.id);
      setReaction([...reactionNew, { react: 'angry', userId: user.id }]);
      setNameReactChosen('angry');
      handleCloseReaction();
      updateDoc(doc(db, 'messages', message.id), {
        ...message,
        reaction: [...reactionNew, { react: 'angry', userId: user.id }]
      });
    }
  };
  const unsentMessage = () => {
    updateDoc(doc(db, 'messages', message.id), {
      ...message,
      isRestore: true
    }).then(() => {
      setIsRestore(true);
      handleCloseDelete();
    });
  };
  const deleteMessage = () => {
    deleteDoc(doc(db, 'messages', message.id)).then(() => {
      handleCloseDelete();
      dispatch(actionChatDeleteMessage(index));
    });
  };
  const BoxMessageUnsentUser = () => {
    const BoxUnsent = styled(Box)(({ theme }) => ({
      border: `1px solid lightgray`,
      padding: theme.spacing(1, 1, 1),
      margin: '0px 10px',
      borderRadius: '20px',
      background: '#fff'
    }));
    return (
      <BoxUnsent>
        <Typography sx={{ color: 'gray' }}>You unsent a message</Typography>
      </BoxUnsent>
    );
  };
  const BoxMessageUnsentOther = () => {
    const BoxUnsent = styled(Box)(({ theme }) => ({
      border: `1px solid lightgray`,
      padding: theme.spacing(1, 1, 1),
      margin: '0px 10px',
      borderRadius: '20px'
    }));
    if (userSent.username === undefined) return null;
    return (
      <BoxUnsent>
        <Typography sx={{ color: 'gray' }}>{userSent.username} unsent a message</Typography>
      </BoxUnsent>
    );
  };
  const Reaction = ({ react }) => {
    if (react === 'like') return <Icon style={{ color: 'blue' }} icon="ant-design:like-filled" />;
    if (react === 'love') return <Icon icon="flat-color-icons:like" />;
    if (react === 'smile') return <Icon icon="emojione:grinning-squinting-face" />;
    if (react === 'wow') return <Icon icon="emojione:face-with-open-mouth" />;
    if (react === 'cry') return <Icon icon="emojione:crying-face" />;
    if (react === 'angry') return <Icon icon="emojione:pouting-face" />;
  };
  const BoxReactMessageUser = () => {
    const BoxReaction = styled(Card)(({ theme }) => ({
      background: '#fff',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px',
      marginRight: '-7px',
      zIndex: 2
    }));
    if (reaction.length === 0) return null;
    if (reaction.length === 1)
      return (
        <BoxReaction onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
          <Reaction react={reaction.at(0).react} />
        </BoxReaction>
      );
    return (
      <BoxReaction onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
        {reaction.map((item, index) => (
          <Reaction react={item.react} key={index} />
        ))}
        <Typography sx={{ fontFamily: 'inherit', color: 'gray', fontSize: '13px' }}>
          {reaction.length}
        </Typography>
      </BoxReaction>
    );
  };
  const BoxContentImageMessage = () => {
    const ContentImage = styled('img')(() => ({
      width: '150px',
      height: '180px',
      borderRadius: '20px'
    }));
    if (imageMessage === '') return <Icon icon="eos-icons:loading" />;
    return <ContentImage src={imageMessage} />;
  };
  const BoxContentGifMessage = () => {
    const ContentGif = styled('img')(() => ({
      width: '150px',
      height: '180px',
      borderRadius: '20px'
    }));
    return <ContentGif src={message.contentFile} />;
  };
  const BoxContentStickerMessage = () => {
    const ContentSticker = styled('img')(() => ({
      width: '150px',
      height: '180px',
      borderRadius: '20px'
    }));
    return <ContentSticker src={message.contentFile} />;
  };
  const BoxReactMessageOther = () => {
    const BoxReaction = styled(Card)(({ theme }) => ({
      background: '#fff',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px',
      marginLeft: '-5px'
    }));
    if (reaction.length === 0) return null;
    if (reaction.length === 1)
      return (
        <BoxReaction onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
          <Reaction react={reaction.at(0).react} />
        </BoxReaction>
      );
    return (
      <BoxReaction onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
        {reaction.map((item, index) => (
          <Reaction react={item.react} key={index} />
        ))}
        <Typography>{reaction.length}</Typography>
      </BoxReaction>
    );
  };
  if (message.chatboxId !== chatbox.id) return null;
  if (message.type === 'note')
    return (
      <Box sx={{ width: '100%', justifyContent: 'center', marginBottom: '10px', display: 'flex' }}>
        <Box
          sx={{
            background: '#fff',
            border: `2px solid #30ab78`,
            padding: `5px`,
            borderRadius: '10px',
            display: 'flex'
          }}
        >
          <Avatar sx={{ width: '25px', height: '25px' }} src={userSent.avatar} />
          <Box sx={{ marginLeft: '5px' }}>
            <Typography sx={{ color: 'gray' }}>{message.content}</Typography>
            <Typography sx={{ color: 'gray', fontSize: '12px' }}>
              {moment(message.createdAt).format('LLL')}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  if (user.id === message.senderId)
    return (
      <BoxMessageUserSender>
        {isRestore ? (
          <BoxMessageUnsentUser />
        ) : (
          <Box
            sx={{ display: 'block', alignItems: 'center', width: '100%', justifyContent: 'end' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'end',
                minHeight: message.type === 'image' ? `${224 + heightContentText}px` : '24px'
              }}
            >
              {showOptions && (
                <BoxOptionUser onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
                  <ButtonOptionUser onClick={handleClickDelete}>
                    <Icon
                      style={{ color: 'gray', width: '18px', height: '18px' }}
                      icon="system-uicons:trash"
                    />
                  </ButtonOptionUser>
                  <ButtonOptionUser onClick={() => dispatch(actionChatReplyMessage(message))}>
                    <Icon
                      style={{ color: 'gray', width: '18px', height: '18px' }}
                      icon="bxs:share"
                    />
                  </ButtonOptionUser>
                  <ButtonOptionUser onClick={handleClickReaction}>
                    <Icon
                      style={{ color: 'gray', width: '18px', height: '18px' }}
                      icon="carbon:face-add"
                    />
                  </ButtonOptionUser>{' '}
                  <Popover
                    id="basic-menu"
                    anchorEl={anchorElReaction}
                    open={openReact}
                    onClose={handleCloseReaction}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                  >
                    <Card
                      sx={{
                        background: '#fff',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <BoxChooseReaction
                        click={likeMessage}
                        isChosen={nameReactChosen === 'like'}
                        icon="ant-design:like-filled"
                      />
                      <BoxChooseReaction
                        click={loveMessage}
                        isChosen={nameReactChosen === 'love'}
                        icon="flat-color-icons:like"
                      />
                      <BoxChooseReaction
                        click={smileMessage}
                        isChosen={nameReactChosen === 'smile'}
                        icon="emojione:grinning-squinting-face"
                      />
                      <BoxChooseReaction
                        click={wowMessage}
                        isChosen={nameReactChosen === 'wow'}
                        icon="emojione:face-with-open-mouth"
                      />
                      <BoxChooseReaction
                        click={cryMessage}
                        isChosen={nameReactChosen === 'cry'}
                        icon="emojione:crying-face"
                      />
                      <BoxChooseReaction
                        click={angryMessage}
                        isChosen={nameReactChosen === 'angry'}
                        icon="emojione:pouting-face"
                      />
                    </Card>
                  </Popover>
                  <Popover
                    id="basic-menu"
                    anchorEl={anchorElDelete}
                    open={openDelete}
                    onClose={handleCloseDelete}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <Card
                      sx={{
                        background: '#fff',
                        padding: '5px',
                        alignItems: 'center',
                        display: 'block',
                        width: '130px'
                      }}
                    >
                      <Button
                        onClick={deleteMessage}
                        sx={{ textTransform: 'none', color: 'gray', fontSize: '15px' }}
                      >
                        Delete message
                      </Button>
                      <Button
                        onClick={unsentMessage}
                        sx={{ textTransform: 'none', color: 'gray', fontSize: '15px' }}
                      >
                        Unsent message
                      </Button>
                    </Card>
                  </Popover>
                </BoxOptionUser>
              )}
              <BoxReactMessageUser />
              <BoxContentMessage
                onMouseEnter={mouseEnterMessage}
                onMouseLeave={mouseLeaveMessage}
                sx={{
                  marginRight: '10px',
                  background: '#30ab78',
                  color: '#fff',
                  marginLeft: '0px'
                }}
              >
                {message.type === 'reply' && <Reply user={user} message={message} />}
                <Typography ref={contentRef}>{message.content}</Typography>
                {message.type === 'image' && <BoxContentImageMessage />}
                {message.type === 'gif' && <BoxContentGifMessage />}
                {message.type === 'sticker' && <BoxContentStickerMessage />}
              </BoxContentMessage>
            </Box>
            <Box
              sx={{ width: '100%', justifyContent: 'end', display: 'flex', alignItems: 'center' }}
            >
              <Typography
                sx={{ color: 'gray', fontFamily: 'inherit', fontSize: '10px', marginRight: '10px' }}
              >
                {moment(message.createdAt).format('LLL')}
              </Typography>
            </Box>
          </Box>
        )}
      </BoxMessageUserSender>
    );
  return (
    <BoxMessageOtherUserSender>
      {userSent.avatar === undefined ? (
        <Skeleton variant="circular" sx={{ width: '35px', height: '35px' }} />
      ) : (
        <AvatarUserSent src={userSent.avatar} />
      )}
      {isRestore ? (
        <BoxMessageUnsentOther />
      ) : (
        <Box sx={{ display: 'block', alignItems: 'center', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              minHeight: message.type === 'image' ? `${200 + heightContentText}px` : '24px'
            }}
          >
            <BoxContentMessage onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {userSent.username}
              </Typography>
              {message.type === 'reply' && <ReplyOther user={user} message={message} />}
              <Typography>{message.content}</Typography>
              {message.type === 'image' && <BoxContentImageMessage />}
              {message.type === 'gif' && <BoxContentGifMessage />}
              {message.type === 'sticker' && <BoxContentStickerMessage />}
            </BoxContentMessage>
            <BoxReactMessageOther />
            {showOptions ? (
              <BoxOptionOther onMouseEnter={mouseEnterMessage} onMouseLeave={mouseLeaveMessage}>
                <ButtonOptionOther onClick={handleClickReaction}>
                  <Icon
                    style={{ color: 'gray', width: '18px', height: '18px' }}
                    icon="carbon:face-add"
                  />
                </ButtonOptionOther>
                <ButtonOptionOther onClick={() => dispatch(actionChatReplyMessage(message))}>
                  <Icon style={{ color: 'gray', width: '18px', height: '18px' }} icon="bxs:share" />
                </ButtonOptionOther>
                <ButtonOptionOther>
                  <Icon
                    style={{ color: 'gray', width: '18px', height: '18px' }}
                    icon="system-uicons:trash"
                  />
                </ButtonOptionOther>
                <Popover
                  id="basic-menu"
                  anchorEl={anchorElReaction}
                  open={openReact}
                  onClose={handleCloseReaction}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                >
                  <Card
                    sx={{
                      background: '#fff',
                      padding: '5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <BoxChooseReaction
                      isChosen={nameReactChosen === 'like'}
                      click={likeMessage}
                      icon="ant-design:like-filled"
                    />
                    <BoxChooseReaction
                      click={loveMessage}
                      isChosen={nameReactChosen === 'love'}
                      icon="flat-color-icons:like"
                    />
                    <BoxChooseReaction
                      click={smileMessage}
                      isChosen={nameReactChosen === 'smile'}
                      icon="emojione:grinning-squinting-face"
                    />
                    <BoxChooseReaction
                      click={wowMessage}
                      isChosen={nameReactChosen === 'wow'}
                      icon="emojione:face-with-open-mouth"
                    />
                    <BoxChooseReaction
                      click={cryMessage}
                      isChosen={nameReactChosen === 'cry'}
                      icon="emojione:crying-face"
                    />

                    <BoxChooseReaction
                      click={angryMessage}
                      isChosen={nameReactChosen === 'angry'}
                      icon="emojione:pouting-face"
                    />
                  </Card>
                </Popover>
              </BoxOptionOther>
            ) : null}
          </Box>
          <Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: 'gray', fontFamily: 'inherit', fontSize: '10px' }}>
              {moment(message.createdAt).format('LLL')}
            </Typography>
          </Box>
        </Box>
      )}
    </BoxMessageOtherUserSender>
  );
}

export default MessageChatgroup;
