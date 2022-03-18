import { getToken } from 'firebase/messaging';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import ScrollToTop from './components/ScrollToTop';
import { actionMe } from './redux/actions/callAction';
import { actionUserBroadcastSocket } from './redux/actions/userAction';
// import { messaging } from './firebase-config';
import Router from './routes';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import { connectWithSocket } from './utils/wssConnection';

function App() {
  const me = useSelector((state) => state.call.me);
  const dispatch = useDispatch();
  let socket;
  useEffect(() => {
    connectWithSocket();
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
