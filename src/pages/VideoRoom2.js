/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Icon } from '@iconify/react';
import Peer from 'simple-peer';
import { Box, Card, Grid, IconButton, styled, Typography } from '@mui/material';
import { Scrollbar } from 'smooth-scrollbar-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import Participant from '../components/room/Participant';
import ModalAddMemberToRoom from '../components/video/ModalAddMemberToRoom';
import {
  actionAddPeers,
  actionModalAddMemberToRoom,
  actionModalReceiveInviteJoinRoom,
  actionSetPeers
} from '../redux/actions/callAction';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px'
}));
const VideoUser = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '200px',
  background: '#fff',
  padding: theme.spacing(2),
  marginTop: '5px'
}));
const BoxOptions = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px',
  justifyContent: 'center'
}));
const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    console.log('video peer', props.peer);
    props.peer.on('stream', (stream) => {
      console.log('video stream', stream);
      ref.current.srcObject = stream;
    });
    return () => null;
  });

  return (
    <IconButton disabled sx={{ width: '100%', height: '250px' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 30,
          left: 20,
          background: '#fff',
          borderRadius: '10px',
          height: '20px',
          padding: '0px 5px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{ fontWeight: 'bold', color: 'gray', fontSize: '12px', fontFamily: 'sans-serif' }}
        >
          {props.userJoin.username}
        </Typography>
      </Box>
      <video style={{ width: '100%', height: '250px' }} muted playsInline autoPlay ref={ref} />
    </IconButton>
  );
};
VideoRoom2.prototype = {
  user: PropTypes.object
};
function VideoRoom2({ user }) {
  const navigate = useNavigate();
  const socket = useSelector((state) => state.call.socket);
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [room, setRoom] = useState({});
  const [members, setMembers] = useState([]);
  const dispatch = useDispatch();
  const modalAddMemberToRoom = useSelector((state) => state.call.modalAddMemberToRoom);
  const allPeers = useSelector((state) => state.call.allPeers);
  const socketRef = useRef();
  const socketIdsJoinRoom = useSelector((state) => state.call.socketIdsJoinRoom);
  const getRoom = () => {
    getDoc(doc(db, 'rooms', roomId)).then((snapshot) => {
      setRoom({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getRoom();
    socketRef.current = socket;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userVideo.current.srcObject = stream;
      socketRef.current.emit('join room', { roomId, userJoin: user });
      socketRef.current.on('all users', (data) => {
        const peers = [];
        data.users.forEach((userID) => {
          const peer = createPeer(userID.socketId, socketRef.current.id, stream, data.userJoin);
          peersRef.current.push({
            peerID: userID.socketId,
            peer
          });
          peers.push({
            peer,
            userJoin: userID.userJoin
          });
        });
        setPeers(peers);
        dispatch(actionSetPeers(peers));
      });

      socketRef.current.on('user joined', (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream, payload.userJoin);
        peersRef.current.push({
          peerID: payload.callerID,
          peer
        });
        setPeers((users) => [...users, peer]);
        dispatch(actionAddPeers(peer));
      });

      socketRef.current.on('receiving returned signal', (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
      socketRef.current.on('stop room', (data) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        navigate('/home/app');
        window.location.reload();
      });
    });
    return () => {
      dispatch(
        actionModalReceiveInviteJoinRoom({
          status: false,
          name: '',
          roomId: ''
        })
      );
      getDoc(doc(db, 'rooms', roomId)).then((snapshot) => {
        if (snapshot.data().userCreate.id === user.id) {
          updateDoc(doc(db, 'rooms', roomId), {
            status: 'ended'
          });
        }
      });
    };
  }, []);
  function createPeer(userToSignal, callerID, stream, userJoin) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        callerID,
        signal,
        userJoin
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream, userJoin) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return {
      peer,
      userJoin
    };
  }
  // useEffect(() => {
  //   socketRef.current = io.connect('https://cd9e-222-253-52-189.ngrok.io/');
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  //     userVideo.current.srcObject = stream;
  //     socketRef.current.emit('join room', roomId);
  //     socketRef.current.on('all users', (users) => {
  //       const peers = [];
  //       users.users.forEach((userID) => {
  //         const peer = createPeer(userID, socketRef.current.id, stream);
  //         peersRef.current.push({
  //           peerID: userID,
  //           peer
  //         });
  //         peers.push(peer);
  //       });
  //       setPeers(peers);
  //     });

  //     socketRef.current.on('user joined', (payload) => {
  //       const peer = addPeer(payload.signal, payload.callerID, stream);
  //       peersRef.current.push({
  //         peerID: payload.callerID,
  //         peer
  //       });

  //       setPeers((users) => [...users, peer]);
  //     });

  //     socketRef.current.on('receiving returned signal', (payload) => {
  //       const item = peersRef.current.find((p) => p.peerID === payload.id);
  //       item.peer.signal(payload.signal);
  //     });
  //   });
  // }, []);
  // function createPeer(userToSignal, callerID, stream) {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream
  //   });

  //   peer.on('signal', (signal) => {
  //     socketRef.current.emit('sending signal', {
  //       userToSignal,
  //       callerID,
  //       signal
  //     });
  //   });

  //   return peer;
  // }

  // function addPeer(incomingSignal, callerID, stream) {
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream
  //   });

  //   peer.on('signal', (signal) => {
  //     socketRef.current.emit('returning signal', { signal, callerID });
  //   });

  //   peer.signal(incomingSignal);

  //   return peer;
  // }
  const BoxParticipants = () => {
    const Participants = styled(Card)(({ theme }) => ({
      width: '100%',
      padding: theme.spacing(2),
      background: '#fff',
      height: '300px',
      maxHeight: '300px',
      display: 'flex'
    }));

    return (
      <Participants>
        <Scrollbar alwaysShowTracks>
          <Typography sx={{ fontWeight: 'bold' }}>Participants ({peers.length + 1})</Typography>
          <Participant room={room} user={user} other={user} />
          {peers.map((item, index) => (
            <Participant user={user} key={index} room={room} other={item.userJoin} />
          ))}
        </Scrollbar>
      </Participants>
    );
  };
  const endCall = () => {
    socketRef.current.emit('stop room', roomId);
  };
  if (room.id === undefined) return null;
  return (
    <RootStyle>
      <Box sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        <Typography>Room Id: {roomId}</Typography>
        <Typography>Socket id invite : {socketIdsJoinRoom.length}</Typography>
        {room.id !== undefined && (
          <Typography>
            Video call group: <b>{room.chatbox.name}</b>
          </Typography>
        )}
      </Box>
      {room.id !== undefined && (
        <Box sx={{ width: '100%', padding: ' 5px 20px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
            Created by: {room.userCreate.username}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
            Created at : {moment(room.createdAt).format(`MM-DD-YYYY, h:mm a`)}
          </Typography>
        </Box>
      )}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Grid sx={{ width: '80%' }} container>
          {peers.map((peer, index) => (
            <Grid sx={{ padding: '5px' }} item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
              <Card sx={{ width: '100%', background: '#fff', height: '250px' }}>
                <Video index={index} peer={peer.peer} userJoin={peer.userJoin} />
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ width: '20%', padding: '5px' }}>
          <BoxParticipants />
          <BoxOptions>
            <IconButton
              onClick={() => {
                dispatch(
                  actionModalAddMemberToRoom({
                    status: true,
                    room
                  })
                );
              }}
              sx={{ color: 'orange', marginRight: '20px' }}
            >
              <Icon
                style={{ width: '40px', height: '40px' }}
                icon="fluent:people-community-add-24-filled"
              />
            </IconButton>
            {user.id === room.userCreate.id ? (
              <IconButton onClick={endCall} sx={{ color: 'red' }}>
                <Icon
                  style={{ width: '40px', height: '40px' }}
                  icon="fluent:record-stop-16-filled"
                />
              </IconButton>
            ) : (
              <IconButton sx={{ color: 'red' }}>
                <Icon style={{ width: '40px', height: '40px' }} icon="fluent:sign-out-20-filled" />
              </IconButton>
            )}
          </BoxOptions>
          <VideoUser>
            <video
              muted
              style={{ width: '100%', height: '100%' }}
              ref={userVideo}
              autoPlay
              playsInline
            />
          </VideoUser>
        </Box>
      </Box>
      {modalAddMemberToRoom.status && <ModalAddMemberToRoom user={user} />}
    </RootStyle>
  );
  // return (
  //   <div>
  //     <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>Room Id: {roomId}</div>
  //     <div>peer: {peers.length}</div>
  //     <div>
  //       <video
  //         style={{ width: '50px', height: '50px' }}
  //         muted
  //         ref={userVideo}
  //         autoPlay
  //         playsInline
  //       />
  //     </div>
  //     {peers.map((peer, index) => (
  //       <Video key={index} peer={peer} />
  //     ))}
  //   </div>
  // );
}

export default VideoRoom2;
