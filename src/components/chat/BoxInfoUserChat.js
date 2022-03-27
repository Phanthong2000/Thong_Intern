import React from 'react';
import { Avatar, Box, Card, IconButton, Skeleton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actionChatOptionsChatbox } from '../../redux/actions/chatAction';

const RootStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1),
  width: '100%',
  background: '#fff',
  marginLeft: '10px',
  marginTop: '10px',
  display: 'flex',
  height: '80px',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const IsOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  right: 5,
  bottom: 5,
  width: '15px',
  height: '15px',
  color: theme.palette.green
}));
const ButtonOptions = styled(IconButton)(({ theme }) => ({
  color: theme.palette.green,
  marginRight: '10px'
}));
function BoxInfoUserChat() {
  const chatbox = useSelector((state) => state.chat.chatbox);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const me = useSelector((state) => state.call.me);
  const navigate = useNavigate();
  const optionsChatbox = useSelector((state) => state.chat.optionsChatbox);
  const dispatch = useDispatch();
  const videoCall = () => {
    const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
    if (userCall === undefined) {
      console.log(userCall);
    } else navigate('/home/video-call');
  };
  const chooseAvatarUserChat = () => {
    navigate(`/home/other/${chatbox.user.id}`);
  };
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {chatbox.id !== '' ? (
          <IconButton onClick={chooseAvatarUserChat}>
            <Avatar sx={{ width: '40px', height: '40px' }} src={chatbox.user.avatar} />
            <IsOnline
              icon="akar-icons:circle-fill"
              style={{
                color:
                  usersSocket.find((socket) => socket.userId === chatbox.user.id) === undefined
                    ? 'gray'
                    : null
              }}
            />
          </IconButton>
        ) : (
          <Skeleton variant="circular" sx={{ width: '40px', height: '40px' }} />
        )}
        <Box sx={{ marginLeft: '10px' }}>
          {chatbox.id !== '' ? (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'sans-serif' }}>
                {chatbox.user.username}
              </Typography>
              <Typography sx={{ fontFamily: 'inherit', fontSize: '14px', color: 'gray' }}>
                {usersSocket.find((socket) => socket.userId === chatbox.user.id) !== undefined
                  ? `Online`
                  : `Offline`}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton variant="text" sx={{ width: '150px', height: '20px' }} />
              <Skeleton variant="text" sx={{ width: '50px', height: '20px' }} />
            </>
          )}
        </Box>
      </Box>
      {chatbox.id !== '' ? (
        <Box>
          <ButtonOptions>
            <Icon icon="fluent:call-48-filled" />
          </ButtonOptions>
          <ButtonOptions onClick={videoCall}>
            <Icon icon="bi:camera-video-fill" />
          </ButtonOptions>
          <ButtonOptions onClick={() => dispatch(actionChatOptionsChatbox(!optionsChatbox))}>
            <Icon icon="entypo:info-with-circle" />
          </ButtonOptions>
        </Box>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Skeleton
            variant="circular"
            sx={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          <Skeleton
            variant="circular"
            sx={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          <Skeleton
            variant="circular"
            sx={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
        </Box>
      )}
    </RootStyle>
  );
}

export default BoxInfoUserChat;
