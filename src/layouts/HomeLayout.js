import React, { useEffect, useState } from 'react';
import { styled, Box, List, ListItem, IconButton, Typography, Backdrop } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import HomeNavbar from './home/HomeNavbar';
import HomeSidebar from './home/HomeSidebar';
import { actionUserCloseSearch, actionUserCloseProfile } from '../redux/actions/userAction';
import Responsive from '../responsive/Responsive';
import { db } from '../firebase-config';
import ChatBox from '../components/home/main/ChatBox';
import BoxNewChatbox from '../components/home/main/BoxNewChatbox';
import ModalReceivingVideoCall from '../components/video/ModalReceivingVideoCall';
import UtilRedux from '../utils/UtilRedux';
import ModalReceivingGroup from '../components/room/ModalReceivingGroup';
import ModalReceiveInviteJoinRoom from '../components/video/ModalReceiveInviteJoinRoom';
import Snack from '../components/Snack';
import ModalSharePost from '../components/post/ModalSharePost';
import Backdrops from '../components/Backdrop';
import ModalInvite from '../components/page/ModalInvite';

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
  const hotToast = useSelector((state) => state.user.hotToast);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [user, setUser] = useState({});
  const chatboxHome = useSelector((state) => state.chat.chatboxHome);
  const newChatbox = useSelector((state) => state.chat.newChatbox);
  const modalReceiving = useSelector((state) => state.call.modalReceiving);
  const modalReceivingGroup = useSelector((state) => state.call.modalReceivingGroup);
  const modalReceiveInviteJoinRoom = useSelector((state) => state.call.modalReceiveInviteJoinRoom);
  const modalSharePost = useSelector((state) => state.post.modalSharePost);
  const modalInvite = useSelector((state) => state.page.modalInvite);
  const { pathname } = useLocation();
  const getUser = async (userId) => {
    const data = await getDoc(doc(db, 'users', userId));
    setUser({
      ...data.data(),
      id: data.id
    });
  };
  const notify = () => toast.success(<ToastDisplay />);
  const ToastDisplay = () => (
    <Box>
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'sans-serif' }}>
        {hotToast}
      </Typography>
    </Box>
  );
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
    if (localStorage.getItem('user') !== null) {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      getUser(userId);
    }
    return () => null;
  }, []);
  useEffect(() => {
    if (hotToast !== '') notify();
    return () => null;
  }, [hotToast]);
  const closeSearch = () => {
    dispatch(actionUserCloseSearch());
  };
  const closeProfileBox = () => {
    dispatch(actionUserCloseProfile());
  };
  // onMessageListener().then((payload) => {
  //   setNotification(payload.notification);
  // });
  return (
    <RootStyle>
      <UtilRedux user={user} />
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
        {chatboxHome.status && (
          <ChatBox user={user} other={chatboxHome.user} chatbox={chatboxHome.chatbox} />
        )}
        {newChatbox && <BoxNewChatbox user={user} />}
        <Toaster />
        {modalReceiving && <ModalReceivingVideoCall user={user} />}
        {modalReceivingGroup && <ModalReceivingGroup user={user} />}
        {modalReceiveInviteJoinRoom.status && !pathname.includes('/home/video-room') && (
          <ModalReceiveInviteJoinRoom />
        )}
        {modalSharePost.status && <ModalSharePost user={user} />}
        {modalInvite.status && <ModalInvite />}
        <Snack />
        <Backdrops />
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}

export default HomeLayout;
