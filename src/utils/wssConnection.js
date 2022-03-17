import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import {
  actionChatAddMessage,
  actionGetAllChatSort,
  actionChatSendReaction,
  actionChatUpdateReactionMessage,
  actionChatInputting,
  actionGetAllBadeMessage
} from '../redux/actions/chatAction';
import {
  actionModalReceiving,
  actionCall,
  actionCallAccepted,
  actionConnection,
  actionMe,
  actionRemoteStream,
  actionCallEnded
} from '../redux/actions/callAction';
import {
  actionUserAddFriendRequest,
  actionUserBroadcastSocket,
  actionUserDeleteFriendRequest,
  actionGetAllNotifications,
  actionGetBadgeNotifications
} from '../redux/actions/userAction';
import store from '../redux/store';

let socket;
export const connectWithSocket = () => {
  socket = io('https://thongintern.herokuapp.com/');
  socket.on('broadcast', (data) => {
    store.dispatch(actionUserBroadcastSocket(data));
  });
  socket.on('me', (id) => store.dispatch(actionMe(id)));
  socket.on('callUser', ({ from, name, signal, stream }) => {
    console.log({ from, name, signal, stream });
    store.dispatch(actionCall({ from, name, signal }));
    store.dispatch(actionModalReceiving(true));
  });
  socket.on('endCall', (data) => {
    console.log('endcall');
    // store.dispatch(actionCallEnded(true));
  });
  socket.on('sendMessage', (data) => {
    console.log('receiver message', data);
    store.dispatch(actionChatAddMessage(data));
    store.dispatch(actionGetAllChatSort(data.receiverId));
    store.dispatch(actionChatInputting(''));
    store.dispatch(actionGetAllBadeMessage(data.receiverId));
  });
  socket.on('sendReaction', (data) => {
    console.log('sendReaction', data);
    store.dispatch(actionChatSendReaction());
  });
  socket.on('addFriend', (data) => {
    console.log('add friend socket', data);
    store.dispatch(actionUserAddFriendRequest(data));
  });
  socket.on('deleteRequestAddFriend', (data) => {
    console.log('deleteRequestAddFriend', data);
    store.dispatch(actionUserDeleteFriendRequest(data.id));
  });
  socket.on('pushNotification', (data) => {
    console.log('push notification', data);
    store.dispatch(actionGetAllNotifications(data.receiverId));
    store.dispatch(actionGetBadgeNotifications(data.receiverId));
  });
  socket.on('inputting', (data) => {
    console.log('inputting', data);
    store.dispatch(actionChatInputting(data.chatboxId));
  });
  socket.on('stopInput', (data) => {
    console.log('stop input');
    store.dispatch(actionChatInputting(''));
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
  const peer = new Peer({ initiator: false, trickle: false, stream: localStream });

  peer.on('signal', (data) => {
    socket.emit('answerCall', { signal: data, to: call.from });
  });

  peer.on('stream', (currentStream) => {
    console.log('remote answer', currentStream);
    store.dispatch(actionRemoteStream(currentStream));
  });

  peer.signal(call.signal);

  store.dispatch(actionConnection(peer));
};
export const callUser = (id) => {
  const localStream = store.getState().call.stream;
  console.log('call user', localStream);
  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: {
      iceServers: [
        {
          urls: 'stun:numb.viagenie.ca',
          username: 'sultan1640@gmail.com',
          credential: '98376683'
        },
        {
          urls: 'turn:numb.viagenie.ca',
          username: 'sultan1640@gmail.com',
          credential: '98376683'
        }
      ]
    },
    stream: localStream
  });
  const { me } = store.getState().call;
  const { name } = store.getState().call;
  peer.on('signal', (data) => {
    console.log('signal', data);
    socket.emit('callUser', {
      userToCall: id,
      signalData: data,
      from: me,
      name
    });
  });

  peer.on('stream', (currentStream) => {
    console.log('remote call', currentStream);
    store.dispatch(actionRemoteStream(currentStream));
  });

  socket.on('callAccepted', (signal) => {
    store.dispatch(actionCallAccepted(true));
    console.log('callaccepted', signal);
    peer.signal(signal);
  });
};
export const endCall = (id) => {
  socket.emit('endCall', { to: id });
};
export const sendMessageSocket = (data) => {
  socket.emit('sendMessage', data);
};
export const sendReactionSocket = (data) => {
  socket.emit('sendReaction', data);
};
export const addFriendSocket = (data) => {
  socket.emit('addFriend', data);
};
export const deleteRequestAddFriendSocket = (data) => {
  socket.emit('deleteRequestAddFriend', data);
};
export const pushNotificationSocket = (data) => {
  socket.emit('pushNotification', data);
};
export const inputtingSocket = (data) => {
  socket.emit('inputting', data);
};
export const stopInputSocket = (data) => {
  socket.emit('stopInput', data);
};
export const logoutSocket = () => {
  socket.disconnect();
};
