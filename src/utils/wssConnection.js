import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import {
  actionModalReceiving,
  actionCall,
  actionCallAccepted,
  actionConnection,
  actionMe,
  actionRemoteStream,
  actionCallEnded
} from '../redux/actions/callAction';
import { actionUserBroadcastSocket } from '../redux/actions/userAction';
import store from '../redux/store';

let socket;
export const connectWithSocket = () => {
  socket = io('http://localhost:5000');
  socket.on('broadcast', (data) => {
    store.dispatch(actionUserBroadcastSocket(data));
  });
  socket.on('me', (id) => store.dispatch(actionMe(id)));
  socket.on('callUser', ({ from, name, signal }) => {
    store.dispatch(actionCall({ from, name, signal }));
    store.dispatch(actionModalReceiving(true));
  });
  socket.on('endCall', (data) => {
    console.log('endcall');
    store.dispatch(actionCallEnded(true));
  });
};
export const registerUser = (data) => {
  socket.emit('register-new-user', data);
};
export const answerCall = () => {
  store.dispatch(actionCallAccepted(true));
  const localStream = store.getState().call.stream;
  console.log('stream answer', localStream);
  const { call } = store.getState().call;
  const peer = new Peer({ initiator: false, trickle: false, localStream });

  peer.on('signal', (data) => {
    socket.emit('answerCall', { signal: data, to: call.from });
  });

  peer.on('stream', (currentStream) => {
    console.log('remote', currentStream);
    store.dispatch(actionRemoteStream(currentStream));
  });

  peer.signal(call.signal);

  store.dispatch(actionConnection(peer));
};
export const callUser = (id) => {
  const localStream = store.getState().call.stream;
  console.log('call user', localStream);
  const peer = new Peer({ initiator: true, trickle: false, localStream });
  const { me } = store.getState().call;
  const { name } = store.getState().call;
  console.log('me', me);
  console.log('name', name);
  peer.on('signal', (data) => {
    console.log('signal', data);
    socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
  });

  peer.on('stream', (currentStream) => {
    console.log('remote', currentStream);
    store.dispatch(actionRemoteStream(currentStream));
  });

  socket.on('callAccepted', (signal) => {
    store.dispatch(actionCallAccepted(true));
    console.log('callaccepted', signal);
    peer.signal(signal);
  });

  store.dispatch(actionConnection(peer));
};
export const endCall = (id) => {
  socket.emit('endCall', { to: id });
};
