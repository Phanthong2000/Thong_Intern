import React, { useEffect, useState } from 'react';
import { styled, Box, List, ListItem, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import HomeNavbar from './home/HomeNavbar';
import HomeSidebar from './home/HomeSidebar';
import { actionUserCloseSearch, actionUserCloseProfile } from '../redux/actions/userAction';
import Responsive from '../responsive/Responsive';
import { db } from '../firebase-config';
import ChatBox from '../components/home/main/ChatBox';
import BoxNewChatbox from '../components/home/main/BoxNewChatbox';

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  display: 'flex'
}));
const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100%',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '80px'
  }
}));
function HomeLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [user, setUser] = useState({});
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const newChatbox = useSelector((state) => state.chat.newChatbox);
  const getUser = async (userId) => {
    const data = await getDoc(doc(db, 'users', userId));
    setUser({
      ...data.data(),
      id: data.id
    });
  };
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
    if (localStorage.getItem('user') !== null) {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      getUser(userId);
    }
    return () => null;
  }, []);
  const closeSearch = () => {
    dispatch(actionUserCloseSearch());
  };
  const closeProfileBox = () => {
    dispatch(actionUserCloseProfile());
  };
  return (
    <RootStyle>
      <Responsive width="mdDown">
        <HomeSidebar user={user} />
      </Responsive>
      <HomeNavbar user={user} />
      <MainStyle
        onClick={() => {
          closeSearch();
          closeProfileBox();
        }}
      >
        {chatboxHome.status && <ChatBox user={user} other={chatboxHome.user} />}
        {newChatbox && <BoxNewChatbox user={user} />}
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}

export default HomeLayout;
