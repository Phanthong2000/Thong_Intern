import React, { useEffect, useState } from 'react';
import {
  Card,
  styled,
  Typography,
  Box,
  Avatar,
  IconButton,
  Popover,
  Button,
  Stack
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { actionGetContact, actionUserContactUserAndOther } from '../redux/actions/userAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '350px',
  height: '200px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2)
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '19px',
  fontFamily: 'inherit'
}));
const ButtonContact = styled(Button)(({ theme }) => ({
  color: '#000',
  textDecoration: 'none',
  background: theme.palette.background,
  padding: theme.spacing(0.5, 2, 0.5),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  width: '45%'
}));
const ButtonChat = styled(Button)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  background: theme.palette.green,
  padding: theme.spacing(0.5, 2, 0.5),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  width: '45%',
  ':hover': {
    background: theme.palette.green
  }
}));
const ButtonEditProfile = styled(Button)(({ theme }) => ({
  color: theme.palette.green,
  textDecoration: 'none',
  background: theme.palette.background,
  textTransform: 'none',
  fontSize: '18px',
  fontWeight: 'bold'
}));
BoxHoverUsernamePost.prototype = {
  user: PropTypes.object
};
function BoxHoverUsernamePost({ user }) {
  const userHover = useSelector((state) => state.user.userHoverUsername);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const friendManual = useSelector((state) => state.user.friendManual);
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const contact = useSelector((state) => state.user.contact);
  const dispatch = useDispatch();
  const [friendMutualUser, setFriendMutualUser] = useState([]);
  const [quantityMutualFriend, setQuantityMutualFriend] = useState(-1);
  const navigate = useNavigate();
  const getAllFriendsSender = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', userHover.id),
        where('status', '==', true)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', userHover.id),
        where('status', '==', true)
      )
    );
    if (data1.empty && data2.empty) {
      setQuantityMutualFriend(0);
    }
    const contacts = [];
    data1.docs.forEach((contact) => {
      contacts.push(contact.data().receiverId);
    });
    data2.docs.forEach((contact) => {
      contacts.push(contact.data().senderId);
    });
    const temp = [];
    if (friendManual.length >= contacts.length) {
      contacts.forEach((friend) => {
        if (friendManual.includes(friend)) {
          temp.push(friend);
        }
      });
    } else {
      friendManual.forEach((friend) => {
        if (contacts.includes(friend)) {
          temp.push(friend);
        }
      });
    }
    setQuantityMutualFriend(temp.length);
    setFriendMutualUser(temp);
  };
  useEffect(() => {
    getAllFriendsSender();
    return () => {
      dispatch(actionUserContactUserAndOther({ id: '', status: '' }));
    };
  }, []);
  const addStory = () => {
    navigate('/home/create-story');
  };
  const ManualFriend = () => {
    if (quantityMutualFriend === 1)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon style={{ color: 'gray' }} icon="fa6-solid:user-group" />
          <Typography sx={{ marginLeft: '5px', color: 'gray' }}>
            {quantityMutualFriend} mutual friend
          </Typography>
        </Box>
      );
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon style={{ color: 'gray' }} icon="fa6-solid:user-group" />
        <Typography sx={{ marginLeft: '5px', color: 'gray' }}>
          {quantityMutualFriend} mutual friends
        </Typography>
      </Box>
    );
  };
  const Information = ({ information, icon }) => {
    const WrapperContent = styled('div')(() => ({
      display: 'flex',
      marginTop: '10px',
      fontSize: '16px',
      alignItems: 'center'
    }));
    const Content = styled(Typography)(() => ({
      fontSize: '16px',
      fontFamily: 'sans-serif',
      marginLeft: '10px',
      width: '90%'
    }));
    if (information === undefined || information === null) return null;
    return (
      <WrapperContent>
        <Icon fontSize={30} style={{ color: 'grey' }} icon={icon} />
        <Content>{information}</Content>
      </WrapperContent>
    );
  };
  if (quantityMutualFriend < 0)
    return (
      <RootStyle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Icon
          style={{
            width: '50px',
            height: '50px',
            color: 'gray'
          }}
          icon="eos-icons:loading"
        />
      </RootStyle>
    );
  return (
    <RootStyle elevation={3}>
      <Stack sx={{ justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <IconButton disabled>
            <Avatar sx={{ width: '100px', height: '100px' }} src={userHover.avatar} />
            <Icon
              style={{
                position: 'absolute',
                bottom: 0,
                right: 5,
                width: '40px',
                height: '40px',
                color:
                  usersSocket.find((socket) => socket.userId === userHover.id) === undefined
                    ? 'gray'
                    : '#30ab78'
              }}
              icon="ci:dot-05-xl"
            />
          </IconButton>
          <Box sx={{ marginLeft: '10px' }}>
            <Username>{userHover.username}</Username>
            {user.id !== userHover.id && <ManualFriend />}
            {userHover.relationship && (
              <Information information={user.relationship} icon="ant-design:heart-filled" />
            )}
          </Box>
        </Box>
        {user.id !== userHover.id ? (
          <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
            {contact.status === 'friend' && (
              <ButtonContact startIcon={<Icon icon="bx:bxs-user-check" />}>Friend</ButtonContact>
            )}
            {contact.status === 'received' && (
              <ButtonContact startIcon={<Icon icon="bx:bxs-user-check" />}>Respond</ButtonContact>
            )}
            {contact.status === 'sent' && (
              <ButtonContact startIcon={<Icon icon="bx:bxs-user-check" />}>Remove</ButtonContact>
            )}
            {contact.status === 'none' && (
              <ButtonContact startIcon={<Icon icon="bx:bxs-user-plus" />}>Add friend</ButtonContact>
            )}
            <ButtonChat
              onClick={() => console.log(contact)}
              startIcon={<Icon icon="bi:chat-left-fill" />}
            >
              Chat
            </ButtonChat>
          </Box>
        ) : (
          <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
            <ButtonChat onClick={addStory} startIcon={<Icon icon="carbon:add-filled" />}>
              Add to story
            </ButtonChat>
            <ButtonEditProfile startIcon={<Icon icon="entypo:edit" />}>
              Edit profile
            </ButtonEditProfile>
          </Box>
        )}
      </Stack>
    </RootStyle>
  );
}

export default BoxHoverUsernamePost;
