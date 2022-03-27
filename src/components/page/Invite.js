import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, Grid, IconButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import {
  actionGetAllPages,
  actionGetLikedPages,
  actionGetAllInvites
} from '../../redux/actions/pageAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  padding: '10px',
  background: '#fff'
}));
const ButtonPromote = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#fff',
  background: theme.palette.green,
  textTransform: 'none',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginTop: '20px',
  ':hover': {
    background: theme.palette.green
  },
  padding: '5px 50px'
}));
Invite.prototype = {
  invite: PropTypes.object
};
function Invite({ invite }) {
  const user = useSelector((state) => state.user.user);
  const [page, setPage] = useState({});
  const [sender, setSender] = useState({});
  const allInvites = useSelector((state) => state.page.allInvites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSender = () => {
    getDoc(doc(db, 'users', invite.senderId)).then((snapshot) => {
      setSender({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  const getPage = () => {
    getDoc(doc(db, 'pages', invite.pageId)).then((snapshot) => {
      setPage({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getSender();
    getPage();
    return () => null;
  }, []);
  const accept = () => {
    const pageNew = {
      ...page,
      likes: [...page.likes, invite.receiverId],
      followers: [...page.followers, invite.receiverId]
    };
    updateDoc(doc(db, 'invites', invite.id), {
      status: true
    }).then(() => {
      updateDoc(doc(db, 'pages', page.id), pageNew).then((snapshot) => {
        dispatch(actionGetAllPages(user.id));
        dispatch(actionGetLikedPages(user.id));
        dispatch(actionGetAllInvites(user.id));
      });
    });
  };
  const goToPage = () => {
    navigate(`/home/pages/${invite.pageId}`);
  };
  const deleteInvite = () => {
    updateDoc(doc(db, 'invites', invite.id), {
      status: true
    }).then(() => {
      dispatch(actionGetAllInvites(user.id));
    });
  };
  if (page.id === undefined || sender.id === undefined) return null;
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Avatar src={page.avatar} sx={{ width: '100px', height: '100px' }} />
          <Box sx={{ marginLeft: '20px' }}>
            <Typography
              onClick={goToPage}
              sx={{
                fontWeight: 'bold',
                fontSize: '20px',
                fontFamily: 'sans-serif',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {page.name}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>
              {page.category}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <Avatar style={{ width: '30px', height: '30px' }} src={sender.avatar} />
              <Typography sx={{ marginLeft: '10px' }}>
                <b>{sender.username}</b> invited you to like this page
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton onClick={deleteInvite} sx={{ width: '40px', height: '40px' }}>
          <Icon icon="eva:close-fill" />
        </IconButton>
      </Box>
      <ButtonPromote onClick={accept} startIcon={<Icon icon="fontisto:like" />}>
        Accept
      </ButtonPromote>
    </RootStyle>
  );
}

export default Invite;
