import React, { useEffect, useRef, useState } from 'react';
import { styled, Box, Typography, Grid, Card } from '@mui/material';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Scrollbar } from 'smooth-scrollbar-react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import Video from '../components/room/Video';

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
function VideoOther({ peer }) {
  const Other = styled('video')(() => ({
    width: '100%',
    height: '100%'
  }));
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video muted playsInline ref={ref} autoPlay>
      <track src="captions_es.vtt" kind="captions" label="spanish_captions" />
    </video>
  );
}
VideoRoom.prototype = {
  user: PropTypes.object
};
function VideoRoom({ user }) {
  const { roomId } = useParams();
  const [room, setRoom] = useState({});
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
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
    socketRef.current = io.connect('https://e75b-113-161-57-30.ngrok.io/');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userVideo.current.srcObject = stream;
      socketRef.current.emit('join room', roomId);
      socketRef.current.on('all users', (users) => {
        const peers = [];
        users.forEach((userID) => {
          const peer = createPeer(userID, socketRef.current.id, stream);
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

        setPeers((users) => [...users, peer]);
      });

      socketRef.current.on('receiving returned signal', (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
    // return () => {
    //   getDoc(doc(db, 'rooms', id)).then((snapshot) => {
    //     if (snapshot.data().userCreate.id === user.id) {
    //       updateDoc(doc(db, 'rooms', id), {
    //         status: 'ended'
    //       });
    //     }
    //   });
    // };
  }, []);
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        callerID,
        signal
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
    const data = [1, 2, 3, 4, 5, 6, 7];
    return (
      <Participants>
        <Scrollbar alwaysShowTracks>
          <Typography sx={{ fontWeight: 'bold' }}>
            {room.userCreate.id} {user.id} (1)
          </Typography>
          {data.map((item, index) => (
            <div key={index} style={{ height: '100px' }}>
              {item}
            </div>
          ))}
        </Scrollbar>
      </Participants>
    );
  };
  if (room.id === undefined) return null;
  return (
    <RootStyle>
      <Box sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        <Typography sx={{ fontSize: '20px', fontFamily: 'sans-serif' }}>
          Video call group : <b>{room.chatbox.name}</b>
        </Typography>
      </Box>
      <Box sx={{ width: '100%', padding: ' 5px 20px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
          Created by: {room.userCreate.username}
        </Typography>
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
          Created at : {moment(room.createdAt).format(`MM-DD-YYYY, h:mm a`)}
        </Typography>
      </Box>
      <Grid sx={{ width: '100%' }} container>
        {/* <Grid sx={{ width: '100%' }} container xs={12} sm={12} md={8} lg={9} xl={9}>
          {peers.map((peer, index) => (
            <Grid
              sx={{ width: '100%', padding: '10px' }}
              key={index}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
            >
              <BoxVideo>
                <VideoOther peer={peer} />
              </BoxVideo>
            </Grid>
          ))}
        </Grid> */}
        {peers.map((peer, index) => (
          <VideoOther key={index} peer={peer} />
        ))}
        <Grid sx={{ width: '100%', padding: '10px' }} item xs={12} sm={12} md={4} lg={3} xl={3}>
          <BoxParticipants />
          <VideoUser>
            <video
              style={{ width: '100%', height: '100%' }}
              muted
              ref={userVideo}
              autoPlay
              playsInline
            />
          </VideoUser>
        </Grid>
      </Grid>
    </RootStyle>
  );
}

export default VideoRoom;
