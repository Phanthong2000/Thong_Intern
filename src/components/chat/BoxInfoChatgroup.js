import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Card, IconButton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { actionChatOptionsChatbox } from '../../redux/actions/chatAction';
import { db } from '../../firebase-config';
import {
  actionAllMembersGroup,
  actionGroup,
  actionParticipants,
  actionSocketIdsGroup
} from '../../redux/actions/callAction';
import { callGroup } from '../../utils/wssConnection';

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
const ButtonOptions = styled(IconButton)(({ theme }) => ({
  color: theme.palette.green,
  marginRight: '10px'
}));
BoxInfoChatgroup.prototype = {
  user: PropTypes.object,
  chatbox: PropTypes.object
};
function BoxInfoChatgroup({ user }) {
  const navigate = useNavigate();
  const me = useSelector((state) => state.call.me);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const optionsChatbox = useSelector((state) => state.chat.optionsChatbox);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const dispatch = useDispatch();
  const checkQuantityMemberChatgroup = () => {
    if (chatbox.members >= 0) return `${chatbox.members.length} member`;
    return `${chatbox.members.length} members`;
  };
  const videoCallGroup = () => {
    addDoc(collection(db, 'rooms'), {
      chatgroup: chatbox,
      members: [{ userId: user.id, socketId: me }],
      userId: user.id
    })
      .then((docRef) => {
        const socketIds = [];
        const allMembers = [];
        chatbox.members.forEach((member) => {
          const userCall = usersSocket.find((user) => user.userId === member);
          if (userCall !== undefined && userCall.userId !== user.id) socketIds.push(userCall);
          if (userCall !== undefined) allMembers.push(userCall);
        });
        dispatch(actionSocketIdsGroup(socketIds));
        dispatch(actionAllMembersGroup(allMembers));
        dispatch(
          actionParticipants({
            members: [{ userId: user.id, socketId: me }],
            allMembers
          })
        );
        dispatch(
          actionGroup({
            id: docRef.id,
            chatgroup: chatbox,
            members: [{ userId: user.id, socketId: me }],
            userCreate: { userId: user.id, socketId: me },
            notMembers: [socketIds],
            userId: user.id
          })
        );
        navigate(`/home/room/${docRef.id}`);
      })
      .catch((err) => console.log(err));
  };
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: '40px', height: '40px' }} src={chatbox.avatar} />
        <Box sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'sans-serif' }}>
            {chatbox.name}
          </Typography>
          <Typography sx={{ fontFamily: 'inherit', fontSize: '14px', color: 'gray' }}>
            {checkQuantityMemberChatgroup()}
          </Typography>
        </Box>
      </Box>
      <Box>
        <ButtonOptions>
          <Icon icon="fluent:call-48-filled" />
        </ButtonOptions>
        <ButtonOptions onClick={videoCallGroup}>
          <Icon icon="bi:camera-video-fill" />
        </ButtonOptions>
        <ButtonOptions onClick={() => dispatch(actionChatOptionsChatbox(!optionsChatbox))}>
          <Icon icon="entypo:info-with-circle" />
        </ButtonOptions>
      </Box>
    </RootStyle>
  );
}

export default BoxInfoChatgroup;
