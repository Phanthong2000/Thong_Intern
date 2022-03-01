import React from 'react';
import { Avatar, Button, Skeleton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { actionChatGetChatboxHome } from '../../../redux/actions/chatAction';

const RootStyle = styled(Button)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  textTransform: 'none',
  background: theme.palette.background,
  color: theme.palette.green,
  alignItems: 'center',
  padding: '10px 5px'
}));
const Username = styled(Typography)(() => ({
  marginLeft: '10px',
  fontWeight: 'bold',
  fontFamily: 'inherit',
  color: '#000',
  fontSize: '17px'
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '40px',
  height: '40px'
}));
Chatgroup.prototype = {
  chatgroup: PropTypes.object
};
function Chatgroup({ chatgroup }) {
  const dispatch = useDispatch();
  const chooseContactChatgroup = () => {
    dispatch(
      actionChatGetChatboxHome({
        status: true,
        user: {},
        chatbox: chatgroup
      })
    );
  };
  return (
    <RootStyle onClick={chooseContactChatgroup}>
      <Avatar sx={{ width: '40px', height: '40px' }} src={chatgroup.avatar} />
      <Username>{chatgroup.name}</Username>
    </RootStyle>
  );
}

export default Chatgroup;
