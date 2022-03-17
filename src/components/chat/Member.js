import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  ListItemButton,
  Popover,
  styled,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionChatGetChatbox } from '../../redux/actions/chatAction';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  marginTop: '5px',
  justifyContent: 'space-between'
}));
Member.prototype = {
  memberId: PropTypes.object,
  user: PropTypes.object,
  userId: PropTypes.string
};
function Member({ user, memberId, userId }) {
  const [userMember, setUserMember] = useState({});
  const chatbox = useSelector((state) => state.chat.chatbox);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    if (memberId !== user.id && chatbox.userId === user.id) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  useEffect(() => {
    getDoc(doc(db, 'users', memberId)).then((snapshot) => {
      setUserMember({
        ...snapshot.data(),
        id: memberId
      });
    });
    return () => null;
  }, []);
  const chooseMember = () => {
    navigate(`/home/other/${memberId}`);
  };
  const makeAdmin = () => {
    updateDoc(doc(db, 'chatboxs', chatbox.id), {
      tempId: memberId,
      userId: memberId
    }).then((snapshot) => {
      handleClose();
      dispatch(
        actionChatGetChatbox({
          ...chatbox,
          tempId: memberId,
          userId: memberId
        })
      );
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Make admin success',
          type: 'success'
        })
      );
    });
  };
  const removeMember = () => {
    const membersNew = chatbox.members.filter((item) => item !== memberId);
    updateDoc(doc(db, 'chatboxs', chatbox.id), { members: membersNew }).then((snapshot) => {
      handleClose();
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Remove member success',
          type: 'success'
        })
      );
      dispatch(
        actionChatGetChatbox({
          ...chatbox,
          members: membersNew
        })
      );
    });
  };
  return (
    <RootStyle>
      <Box onClick={chooseMember} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Avatar src={userMember.avatar} />
        <Box sx={{ marginLeft: '5px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
            {userMember.username}
          </Typography>
          {memberId === userId && (
            <Typography sx={{ color: 'gray', fontSize: '12px' }}>Admin</Typography>
          )}
        </Box>
      </Box>
      <IconButton onClick={handleClick}>
        <Icon icon="bi:three-dots" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
      >
        <Box sx={{ background: '#fff' }}>
          <ListItemButton onClick={makeAdmin}>Make admin</ListItemButton>
          <ListItemButton onClick={removeMember}>Remove member</ListItemButton>
        </Box>
      </Popover>
    </RootStyle>
  );
}

export default Member;
