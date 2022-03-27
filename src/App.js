import { doc, getDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import ScrollToTop from './components/ScrollToTop';
import { db } from './firebase-config';
import { actionMe } from './redux/actions/callAction';
import { actionUserBroadcastSocket, actionUserGetUser } from './redux/actions/userAction';
// import { messaging } from './firebase-config';
import Router from './routes';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import { connectWithSocket } from './utils/wssConnection';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const getUser = (userId) => {
    getDoc(doc(db, 'users', userId)).then((snapshot) => {
      dispatch(
        actionUserGetUser({
          ...snapshot.data(),
          id: snapshot.id
        })
      );
    });
  };
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
    if (localStorage.getItem('user') !== null) {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      getUser(userId);
      connectWithSocket();
    }
    return () => null;
  }, []);
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <Router />
    </ThemeConfig>
  );
}

export default App;
