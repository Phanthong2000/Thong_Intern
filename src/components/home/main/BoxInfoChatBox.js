import React from 'react';
import { Avatar, Box, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionChatGetChatboxHome } from '../../../redux/actions/chatAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  background: '#fff',
  height: '60px',
  padding: `5px`
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  ':hover': {
    background: theme.palette.background,
    borderRadius: '5px'
  }
}));
const BoxOption = styled(Box)(() => ({
  display: 'flex'
}));
const ButtonOptions = styled(IconButton)(({ theme }) => ({
  color: theme.palette.green
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
const IconOption = styled(Icon)(() => ({
  width: '20px',
  height: '20px'
}));
BoxInfoChatBox.prototype = {
  user: PropTypes.object,
  other: PropTypes.object,
  chatbox: PropTypes.object
};
function BoxInfoChatBox({ user, other, chatbox }) {
  const dispatch = useDispatch();
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const navigate = useNavigate();
  const hiddenChatboxHome = () => {
    dispatch(
      actionChatGetChatboxHome({
        status: false,
        user: other
      })
    );
  };
  const closeChatboxHome = () => {
    dispatch(
      actionChatGetChatboxHome({
        status: false,
        user: {}
      })
    );
  };
  const chooseAvatarUserChat = () => {
    navigate(`/home/other/${other.id}`);
  };
  const quantityMember = () => {
    if (chatbox.members.length === 0) return null;
    if (chatbox.members.length === 1) return `1 member`;
    return `${chatbox.members.length} members`;
  };
  if (chatbox.type === 'group')
    return (
      <RootStyle elevation={1}>
        <Stack sx={{ justifyContent: 'space-between' }} direction="row">
          <BoxInfo>
            <Avatar src={chatbox.avatar} />
            <Box sx={{ justifyContent: 'center', marginLeft: '10px' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>{chatbox.name}</Typography>
              <Typography sx={{ color: 'gray', fontSize: '14px' }}>{quantityMember()}</Typography>
            </Box>
          </BoxInfo>
          <BoxOption>
            <ButtonOptions>
              <IconOption icon="fluent:call-48-filled" />
            </ButtonOptions>
            <ButtonOptions>
              <IconOption icon="bi:camera-video-fill" />
            </ButtonOptions>
            <ButtonOptions>
              <IconOption onClick={hiddenChatboxHome} icon="bx:minus" />
            </ButtonOptions>
            <ButtonOptions onClick={closeChatboxHome}>
              <IconOption icon="eva:close-fill" />
            </ButtonOptions>
          </BoxOption>
        </Stack>
      </RootStyle>
    );
  return (
    <RootStyle elevation={1}>
      <Stack sx={{ justifyContent: 'space-between' }} direction="row">
        <BoxInfo onClick={chooseAvatarUserChat}>
          <IconButton disabled sx={{ width: '50px', height: '50px' }}>
            <Avatar src={other.avatar} />
            <IsOnline
              icon="akar-icons:circle-fill"
              style={{
                color:
                  usersSocket.find((socket) => socket.userId === chatboxHome.user.id) === undefined
                    ? 'gray'
                    : null
              }}
            />
          </IconButton>
          <Box sx={{ justifyContent: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>{other.username}</Typography>
            {usersSocket.find((socket) => socket.userId === chatboxHome.user.id) !== undefined && (
              <Typography sx={{ color: 'gray', fontSize: '14px' }}>Active now</Typography>
            )}
          </Box>
        </BoxInfo>
        <BoxOption>
          <ButtonOptions>
            <IconOption icon="fluent:call-48-filled" />
          </ButtonOptions>
          <ButtonOptions>
            <IconOption icon="bi:camera-video-fill" />
          </ButtonOptions>
          <ButtonOptions>
            <IconOption onClick={hiddenChatboxHome} icon="bx:minus" />
          </ButtonOptions>
          <ButtonOptions onClick={closeChatboxHome}>
            <IconOption icon="eva:close-fill" />
          </ButtonOptions>
        </BoxOption>
      </Stack>
    </RootStyle>
  );
}

export default BoxInfoChatBox;
