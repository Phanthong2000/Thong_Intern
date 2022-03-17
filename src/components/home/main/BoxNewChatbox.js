import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Stack,
  styled,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionChatGetChatboxHome,
  actionChatGetNewChatboxHome,
  actionGetAllChatSort,
  actionGetChatgroupUser
} from '../../../redux/actions/chatAction';
import { db } from '../../../firebase-config';

const RootStyle = styled(Card)(() => ({
  width: '350px',
  height: '500px',
  maxHeight: '600px',
  position: 'fixed',
  bottom: 0,
  right: 100,
  background: '#fff',
  padding: '10px',
  zIndex: 999
}));
const BoxTag = styled(Grid)(({ theme }) => ({
  border: `1px solid lightgrey`,
  padding: theme.spacing(1, 1, 1),
  minHeight: '50px',
  maxHeight: '100px',
  overflow: 'auto'
}));
const ButtonCreate = styled(Button)(({ theme }) => ({
  padding: '0px 20px',
  color: '#fff',
  textTransform: 'none',
  background: theme.palette.green,
  fontWeight: 'bold',
  fontSize: '18px',
  ':hover': {
    background: theme.palette.green
  }
}));
BoxNewChatbox.prototype = {
  user: PropTypes.object
};
function BoxNewChatbox({ user }) {
  const inputRef = useRef();
  const [usersChoose, setUserChoose] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState([]);
  const newChatbox = useSelector((state) => state.chat.newChatbox);
  const dispatch = useDispatch();
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const getAllUsers = async () => {
    const data = await getDocs(collection(db, 'users'));
    const users = [];
    if (!data.empty) {
      data.docs.forEach((userDoc) => {
        if (userDoc.id !== user.id) {
          users.push({
            ...userDoc.data(),
            id: userDoc.id
          });
        }
      });
    }
    setAllUsers(users);
    setUsersSearch(users);
  };
  useEffect(() => {
    getAllUsers();
    return () => null;
  }, []);
  const closeNewMessage = () => {
    dispatch(actionChatGetNewChatboxHome(!newChatbox));
  };
  const searchUser = (text) => {
    inputRef.current = text;
    if (text) {
      const data = [];
      allUsers.forEach((userSearch) => {
        if (userSearch.username.toLowerCase().includes(inputRef.current.toLowerCase())) {
          data.push(userSearch);
        }
      });
      setUsersSearch(data);
    } else {
      getAllUsers();
    }
  };
  const createChatbox = () => {
    if (usersChoose.length === 1) {
      dispatch(actionChatGetChatboxHome({ status: true, user: usersChoose.at(0), chatbox: {} }));
      dispatch(actionChatGetNewChatboxHome(false));
    }
    if (usersChoose.length > 1) {
      const members = [];
      usersChoose.forEach((item) => {
        members.push(item.id);
      });
      const chatgroup = {
        name: 'No name',
        avatar: 'https://viettourist.com/resources/images/Blog-Khachdoan/teamb1.png',
        type: 'group',
        background: '',
        userId: user.id,
        members: [...members, user.id],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      addDoc(collection(db, 'chatboxs'), chatgroup).then((docRef) => {
        const message = {
          content: `${user.username} created group`,
          type: 'note',
          senderId: user.id,
          chatboxId: docRef.id,
          isRead: false,
          isRestore: false,
          reaction: [],
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message).then(() => {
          dispatch(actionGetAllChatSort(user.id));
          dispatch(actionChatGetNewChatboxHome(false));
          dispatch(actionGetChatgroupUser(user.id));
        });
      });
    }
  };
  const UserSearch = ({ userSearch }) => {
    const User = styled(Button)(({ theme }) => ({
      width: '100%',
      height: '50px',
      justifyContent: 'start',
      textTransform: 'none',
      color: theme.palette.green
    }));
    const chooseUserSearch = () => {
      setUserChoose([...usersChoose, userSearch]);
    };
    if (usersChoose.includes(userSearch)) return null;
    return (
      <User onClick={chooseUserSearch}>
        <IconButton disabled>
          <Avatar src={userSearch.avatar} />
          <Icon
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              color:
                usersSocket.find((socket) => socket.userId === userSearch.id) === undefined
                  ? 'gray'
                  : '#30ab78'
            }}
            icon="ci:dot-05-xl"
          />
        </IconButton>
        <Typography sx={{ color: '#000', fontWeight: 'bold', fontSize: '16px' }}>
          {userSearch.username}
        </Typography>
      </User>
    );
  };
  const ChipUserSearch = ({ chip, index }) => {
    const RootStyle = styled(Grid)(({ theme }) => ({
      //   display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 1, 0.5)
    }));
    const BoxChip = styled(Box)(({ theme }) => ({
      background: theme.palette.background,
      color: theme.palette.green,
      padding: theme.spacing(0.5, 1, 0.5),
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '5px',
      justifyContent: 'space-between'
    }));
    const removeChooseUserSearch = () => {
      setUserChoose([...usersChoose.filter((user) => user.id !== chip.id)]);
    };
    return (
      <RootStyle item xs={6} sm={6} md={6} lg={6} xl={6}>
        <BoxChip>
          <Typography sx={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'inherit' }}>
            {chip.username}
          </Typography>
          <Icon
            onClick={removeChooseUserSearch}
            style={{
              color: '#30ab78',
              cursor: 'pointer'
            }}
            icon="bi:x-circle"
          />
        </BoxChip>
      </RootStyle>
    );
  };
  return (
    <RootStyle elevation={3}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontFamily: 'inherit', fontSize: '18px' }}>
            New message
          </Typography>
          <IconButton onClick={closeNewMessage}>
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Box>
          <Typography sx={{ color: 'gray', fontSize: '14px' }}>To: </Typography>
          <BoxTag container>
            {usersChoose.map((item, index) => (
              <ChipUserSearch chip={item} index={index} key={index} />
            ))}
          </BoxTag>
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Typography>Search: </Typography>
          <InputBase
            ref={inputRef}
            onChange={(e) => searchUser(e.target.value)}
            sx={{ marginLeft: '5px' }}
            autoFocus
          />
        </Stack>
        <Divider />
        <Box sx={{ display: 'flex', maxHeight: '250px', height: '250px' }}>
          <Scrollbar alwaysShowTracks>
            {usersSearch.map((item, index) => (
              <UserSearch key={index} userSearch={item} />
            ))}
          </Scrollbar>
        </Box>
        <Box
          sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}
        >
          <ButtonCreate onClick={createChatbox}>Create</ButtonCreate>
        </Box>
      </Box>
    </RootStyle>
  );
}

export default BoxNewChatbox;
