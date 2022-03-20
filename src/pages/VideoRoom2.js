/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Box, Card, Grid, styled, Typography } from '@mui/material';
import { Scrollbar } from 'smooth-scrollbar-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import Participant from '../components/room/Participant';

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
  marginTop: '20px'
}));
const BoxVideo = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '250px',
  background: '#fff',
  padding: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    height: '300px'
  }
}));
const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video style={{ width: '100%', height: '100%' }} muted playsInline autoPlay ref={ref} />;
};
VideoRoom2.prototype = {
  user: PropTypes.object
};
function VideoRoom2({ user }) {
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [room, setRoom] = useState({});
  const [members, setMembers] = useState([]);
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
    socketRef.current = io.connect('https://6641-14-161-70-171.ngrok.io/');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userVideo.current.srcObject = stream;
      socketRef.current.emit('join room', { roomId, userJoin: user });
      socketRef.current.on('all users', (data) => {
        const peers = [];
        data.users.forEach((userID) => {
          const peer = createPeer(userID, socketRef.current.id, stream, data.userJoin);
          peersRef.current.push({
            peerID: userID,
            peer
          });
          peers.push(peer);
        });
        setPeers(peers);
      });

      socketRef.current.on('user joined', (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer
        });
        getRoom();
        setPeers((users) => [...users, peer]);
      });

      socketRef.current.on('receiving returned signal', (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
    return () => {
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

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }
  const BoxParticipants = () => {
    const Participants = styled(Card)(({ theme }) => ({
      width: '100%',
      padding: theme.spacing(2),
      background: '#fff',
      height: '350px',
      maxHeight: '350px',
      display: 'flex'
    }));
    return (
      <Participants>
        <Scrollbar alwaysShowTracks>
          <Typography sx={{ fontWeight: 'bold' }}>Participants ({room.members.length})</Typography>
          {room.members.map((item, index) => (
            <Participant key={index} otherId={item.id} />
          ))}
        </Scrollbar>
      </Participants>
    );
  };
  if (room.id === undefined) return null;
  return (
    <RootStyle>
      <Box sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        <Typography>Room Id: {roomId}</Typography>
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
              <Card sx={{ width: '100%', padding: '10px', background: '#fff', height: '250px' }}>
                <Video peer={peer} />
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ width: '20%', padding: '5px' }}>
          <BoxParticipants />
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
    </RootStyle>
  );
  //   return (
  //     <div>
  //       <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>Room Id: {roomId}</div>
  //       <div>peer: {peers.length}</div>
  //       <div>
  //         <video
  //           style={{ width: '50px', height: '50px' }}
  //           muted
  //           ref={userVideo}
  //           autoPlay
  //           playsInline
  //         />
  //       </div>
  //       {peers.map((peer, index) => (
  //         <Video key={index} peer={peer} />
  //       ))}
  //     </div>
  //   );
}

export default VideoRoom2;
