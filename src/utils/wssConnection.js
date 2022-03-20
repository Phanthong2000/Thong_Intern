import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  actionCallEnded,
  actionVideoOther,
  actionStartCount,
  actionModalReceivingGroup,
  actionRemoteStreamGroup,
  actionCallAcceptedGroup,
  actionCallGroup,
  actionGroup,
  actionAddRemoteStreamGroup,
  actionAddSignalGroup,
  actionParticipants,
  actionCallEndedGroup,
  actionAudioOther
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
  socket = io('https://6641-14-161-70-171.ngrok.io/', {
    forceNew: true
  });
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
    const localStream = store.getState().call.stream;
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    store.dispatch(actionCallEnded(true));
  });
  socket.on('videoOther', (data) => {
    store.dispatch(actionVideoOther(data));
  });
  socket.on('audioOther', (data) => {
    console.log('audio Other');
    store.dispatch(actionAudioOther(data));
  });
  socket.on('missCall', (data) => {
    store.dispatch(actionModalReceiving(false));
  });
  socket.on('startCount', (data) => {
    store.dispatch(actionStartCount(data));
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

  socket.on('callGroup', (data) => {
    console.log('group', data);
    store.dispatch(actionCallGroup(data));
    store.dispatch(actionGroup(data.group));
    store.dispatch(actionModalReceivingGroup(true));
    console.log('allmembers redux', data.allMembers);
    store.dispatch(actionAddSignalGroup(data.signalData));
  });
  socket.on('joinGroup', ({ group, signal }) => {
    store.dispatch(actionAddSignalGroup(signal));
    store.dispatch(actionGroup(group));
  });
  socket.on('participants', (data) => {
    console.log('participants', data);
    store.dispatch(actionParticipants(data));
  });
  socket.on('endCallGroup', (data) => {
    console.log('end call group', data);
    store.dispatch(actionCallEndedGroup(true));
    store.dispatch(actionModalReceivingGroup(false));
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
export const callUser = (id, username) => {
  const localStream = store.getState().call.stream;
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
      name: username
    });
  });

  peer.on('stream', (currentStream) => {
    console.log('remote call', currentStream);
    socket.emit('startCount', { socketId: id, status: true });
    store.dispatch(actionRemoteStream(currentStream));
    store.dispatch(actionStartCount(true));
  });

  socket.on('callAccepted', (signal) => {
    store.dispatch(actionCallAccepted(true));
    console.log('callaccepted', signal);
    peer.signal(signal);
  });
};
// export const answerCallGroup = () => {
//   store.dispatch(actionCallAcceptedGroup(true));
//   const { localStreamGroup } = store.getState().call;
//   console.log('answer local stream', localStreamGroup);
//   const { callGroup } = store.getState().call;
//   const { group } = store.getState().call;
//   const peer = new Peer({ initiator: false, trickle: false, stream: localStreamGroup });

//   peer.on('signal', (data) => {
//     console.log('1');
//     console.log('signal anwer group', { signal: data, to: callGroup.from, group });
//     socket.emit('answerCallGroup', { signal: data, to: callGroup.from, group });
//   });
//   peer.on('stream', (currentStream) => {
//     console.log('remote answer', currentStream);
//     store.dispatch(actionAddRemoteStreamGroup(currentStream));
//   });
//   console.log('2');
//   peer.signal(callGroup.signalData);
// };
export const callGroup = (socketIds, group) => {
  const { localStreamGroup } = store.getState().call;
  const { me } = store.getState().call;
  const { allMembers } = store.getState().call;
  const { participants } = store.getState().call;
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
    stream: localStreamGroup
  });
  peer.on('signal', (data) => {
    socket.emit('callGroup', {
      socketIds,
      signalData: data,
      group,
      from: me,
      allMembers
    });
    socket.emit('participants', participants);
  });
  peer.on('stream', (currentStream) => {
    console.log('remote call group', currentStream);
    store.dispatch(actionAddRemoteStreamGroup(currentStream));
  });

  socket.on('joinGroup', (data) => {
    store.dispatch(actionCallAcceptedGroup(true));
    store.dispatch(actionGroup(data.group));
    console.log('callaccepted group1', data.signal);
    peer.signal(data.signal);
  });
};

export const joinGroup = (id) => {
  const { group } = store.getState().call;
  const { localStreamGroup } = store.getState().call;
  const { callGroup } = store.getState().call;
  const { signalGroup } = store.getState().call;
  const { participants } = store.getState().call;
  // const config = {
  //   iceServers: [
  //     { url: 'stun:stun1.l.google.com:19302' },
  //     {
  //       url: 'turn:numb.viagenie.ca',
  //       credential: 'muazkh',
  //       username: 'webrtc@live.com'
  //     }
  //   ]
  // };
  // const peerConnection = new RTCPeerConnection(config);
  // peerConnection.createOffer().then((sdp) => {
  //   peerConnection.setRemoteDescription(sdp);
  //   console.log(sdp);
  const peer = new Peer({
    initiator: false,
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
    stream: localStreamGroup
  });
  socket.emit('participants', participants);
  console.log('signal join group', signalGroup);
  signalGroup.forEach((signal) => {
    if (signal.type === 'offer') {
      peer.on('signal', (data) => {
        socket.emit('joinGroup', {
          group,
          signal: data,
          allMembers: callGroup.allMembers,
          userJoin: id
        });
      });
      peer.signal(signal);
    }
  });

  peer.on('stream', (currentStream) => {
    console.log('remote join group', currentStream);
    store.dispatch(actionAddRemoteStreamGroup(currentStream));
  });

  socket.on('joinGroup', (data) => {
    store.dispatch(actionCallAcceptedGroup(true));
    store.dispatch(actionGroup(data.group));
    peer.signal(data.signal);
  });

  // });
};
export const videoOther = (data) => {
  socket.emit('videoOther', data);
};
export const audioOther = (data) => {
  console.log('audio other user');
  socket.emit('audioOther', data);
};
export const endCall = (id) => {
  socket.emit('endCall', { socketId: id });
};
export const endCallGroup = () => {
  const { allMembers } = store.getState().call;
  socket.emit('endCallGroup', allMembers);
};
export const outRoomCallGroup = (participants) => {
  socket.emit('participants', participants);
};
export const missCall = (id) => {
  socket.emit('missCall', { socketId: id });
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
