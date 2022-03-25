/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Icon } from '@iconify/react';
import Peer from 'simple-peer';
import { Box, Button, Card, Grid, IconButton, styled, Typography } from '@mui/material';
import { Scrollbar } from 'smooth-scrollbar-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import Participant from '../components/room/Participant';
import ModalAddMemberToRoom from '../components/video/ModalAddMemberToRoom';
import {
  actionAddPeers,
  actionAudio,
  actionDeletePeers,
  actionFacingMode,
  actionModalAddMemberToRoom,
  actionModalReceiveInviteJoinRoom,
  actionSetPeers,
  actionTurnOffAudioRoom,
  actionTurnOffVideoRoom,
  actionTurnOnAudioRoom,
  actionTurnOnVideoRoom,
  actionVideo
} from '../redux/actions/callAction';
import { actionOpenSnackbar } from '../redux/actions/postAction';
import { actionUserHotToast } from '../redux/actions/userAction';

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
  padding: theme.spacing(1),
  marginTop: '5px'
}));
const BoxOptions = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px',
  justifyContent: 'center'
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const BoxLeft = styled(Grid)(({ theme }) => ({
  width: '75%',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const BoxRight = styled(Box)(({ theme }) => ({
  width: '25%',
  padding: '5px',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const Video = (props) => {
  const turnOffVideoRoom = useSelector((state) => state.call.turnOffVideoRoom);
  const turnOffAudioRoom = useSelector((state) => state.call.turnOffAudioRoom);
  const allPeers = useSelector((state) => state.call.allPeers);
  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      console.log('stream');
      ref.current.srcObject = stream;
    });
    props.peer.on('connect', () => {
      console.log('connect');
    });
    props.peer.on('close', (close) => {
      console.log('close', close);
    });
    props.peer.on('data', () => {
      console.log('daa');
    });
    props.peer.on('end', () => {
      console.log('end');
    });
    props.peer.on('error', (error) => {
      console.log('error', error);
      //   const allPeersNew = allPeers.filter((peer) => peer.userJoin !== props.userJoin);
      //   console.log('new peers', allPeersNew);
      //   dispatch(actionSetPeers(allPeersNew));
      //   dispatch(
      //     actionOpenSnackbar({
      //       status: true,
      //       content: `${props.userJoin.username} out room`,
      //       type: 'success'
      //     })
      //   );
    });
    props.peer.on('pause', () => {
      console.log('pause');
    });
    props.peer.on('readable', () => {
      console.log('readable');
    });
    props.peer.on('resume', () => {
      console.log('resume');
    });
    props.peer.on('track', () => {
      console.log('track');
    });
    return () => null;
  }, []);
  return (
    <Card sx={{ width: '100%', background: '#fff', height: '250px' }}>
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
        <video
          style={{ width: '100%', height: '250px' }}
          hidden={turnOffVideoRoom.includes(props.userJoin.id)}
          muted={turnOffAudioRoom.includes(props.userJoin.id)}
          playsInline
          autoPlay
          ref={ref}
        />
      </IconButton>
    </Card>
  );
};
const VideoPin = (props) => {
  const turnOffVideoRoom = useSelector((state) => state.call.turnOffVideoRoom);
  const turnOffAudioRoom = useSelector((state) => state.call.turnOffAudioRoom);
  const allPeers = useSelector((state) => state.call.allPeers);
  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      console.log('stream');
      ref.current.srcObject = stream;
    });
    props.peer.on('close', () => {
      console.log('close');
    });
    props.peer.on('connect', () => {
      console.log('connect');
    });
    props.peer.on('data', () => {
      console.log('data');
    });
    props.peer.on('end', () => {
      console.log('end');
    });
    props.peer.on('error', () => {
      const allPeersNew = allPeers.filter((peer) => peer.userJoin !== props.userJoin);
      console.log('new peers', allPeersNew);
      dispatch(actionSetPeers(allPeersNew));
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: `${props.userJoin.username} out room`,
          type: 'success'
        })
      );
    });
    props.peer.on('pause', () => {
      console.log('pause');
    });
    props.peer.on('readable', () => {
      console.log('readable');
    });
    props.peer.on('resume', () => {
      console.log('resume');
    });
    props.peer.on('track', () => {
      console.log('track');
    });
    props.peer.on('signal', () => {
      console.log('signal');
    });
    return () => null;
  }, []);
  return (
    <Card sx={{ width: '100%', background: '#fff', height: '50%' }}>
      <IconButton disabled sx={{ width: '100%', height: '100%' }}>
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
        <video
          style={{ width: '100%', height: '100%' }}
          hidden={turnOffVideoRoom.includes(props.userJoin.id)}
          muted={turnOffAudioRoom.includes(props.userJoin.id)}
          playsInline
          autoPlay
          ref={ref}
        />
      </IconButton>
    </Card>
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
  const me = useSelector((state) => state.call.me);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const dispatch = useDispatch();
  const modalAddMemberToRoom = useSelector((state) => state.call.modalAddMemberToRoom);
  const allPeers = useSelector((state) => state.call.allPeers);
  const socketRef = useRef();
  const audio = useSelector((state) => state.call.audio);
  const video = useSelector((state) => state.call.video);
  const facing = useSelector((state) => state.call.facing);
  const room = useSelector((state) => state.call.room);
  const allPeersRef = useRef();
  const [localStream, setLocalStream] = useState({});
  useEffect(() => {
    socketRef.current = socket;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: facing
        },
        audio: true
      })
      .then((stream) => {
        setLocalStream(stream);
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join room', { roomId, userJoin: user });
        socketRef.current.on('all users', (data) => {
          console.log('all user', data);
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
          allPeersRef.current = peers;
          console.log('all user  all peer ref', allPeersRef.current);
          console.log('all user peer ref', peersRef.current);
          console.log('all user me', socketRef.current.id);
        });
        socketRef.current.on('user joined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream, payload.userJoin);
          peersRef.current.push({
            peerID: payload.callerID,
            peer
          });
          setPeers((users) => [...users, peer]);
          dispatch(actionAddPeers(peer));
          allPeersRef.current.push(peer);
          dispatch(actionUserHotToast(`${payload.userJoin.username} join room`));
          console.log('user join  all peer ref', allPeersRef.current);
          console.log('user join peer ref', peersRef.current);
          console.log('user join me', socketRef.current.id);
        });

        socketRef.current.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          console.log('receiving returned peer ref', peersRef.current);
          console.log('receiving returned payload', payload);
          console.log('receiving returned peer', item.peer);
          item.peer.signal(payload.signal);
        });
        socketRef.current.on('stop room', (data) => {
          navigate('/home/app');
          window.location.reload();
        });
        socketRef.current.on('cede host', (data) => {
          // getRoom();
          dispatch(
            actionOpenSnackbar({
              status: true,
              content: `${data.userCreate.username} become new host`,
              type: 'success'
            })
          );
        });
        socketRef.current.on('turn off video room', (data) => {
          dispatch(actionTurnOffVideoRoom(data));
        });
        socketRef.current.on('turn on video room', (data) => {
          dispatch(actionTurnOnVideoRoom(data));
        });
        socketRef.current.on('turn off audio room', (data) => {
          dispatch(actionTurnOffAudioRoom(data));
        });
        socketRef.current.on('turn on audio room', (data) => {
          dispatch(actionTurnOnAudioRoom(data));
        });
        socketRef.current.on('out room other', (data) => {
          // outRoom();
          const allPeersNew = allPeersRef.current.filter(
            (peer) => peer.userJoin.id !== data.userJoin.id
          );
          allPeersRef.current = allPeersNew;
          dispatch(actionSetPeers(allPeersNew));
          const peersRefNew = peersRef.current.filter((peer) => peer.peerID !== data.socketId);
          peersRef.current = peersRefNew;
          dispatch(
            actionOpenSnackbar({
              status: true,
              content: `${data.userJoin.username} out room`,
              type: 'success'
            })
          );
        });
        socketRef.current.on('out room', (data) => {
          // userVideo.current.srcObject.getTracks().forEach((track) => {
          //   track.stop();
          // });
          allPeersRef.current = [];
          console.log('local stream out room', userVideo.current.srcObject);
          navigate('/home/app');
          window.location.reload();
        });
        socketRef.current.on('replace peers', (data) => {
          const allPeersNew = allPeersRef.current.filter(
            (peer) => peer.userJoin.id !== data.userJoin.id
          );
          allPeersRef.current = allPeersNew;
          // dispatch(actionSetPeers(allPeersNew));
          const peersRefNew = peersRef.current.filter((peer) => peer.peerID !== data.socketId);
          // peersRef.current = peersRefNew;
          console.log('replace peers all peers ref', allPeersRef.current);
          console.log('replace peers all peers ref new', allPeersNew);
          console.log('replace peers  peers ref new', peersRefNew);
          console.log('replace peers  peers ref', peersRef.current);
        });
      });
    return () => {
      dispatch(actionSetPeers([]));
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
  }, [facing]);
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
    console.log('add peers', userVideo.current.srcObject);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: userVideo.current.srcObject
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
          <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>
            Participants ({allPeers.length + 1})
          </Typography>
          <Participant room={room} user={user} other={user} />
          {allPeers.map((item, index) => (
            <Participant user={user} key={index} room={room} other={item.userJoin} />
          ))}
        </Scrollbar>
      </Participants>
    );
  };
  const endCall = () => {
    socketRef.current.emit('stop room', roomId);
  };
  const outRoom = () => {
    navigate('/home/app');
    window.location.reload();
  };
  const turnOnAudio = () => {
    socketRef.current.emit('turn on audio room', { roomId, userTurnOn: user.id });
    dispatch(actionAudio(true));
  };
  const turnOffAudio = () => {
    socketRef.current.emit('turn off audio room', { roomId, userTurnOff: user.id });
    dispatch(actionAudio(false));
  };
  const turnOnVideo = () => {
    socketRef.current.emit('turn on video room', { roomId, userTurnOn: user.id });
    dispatch(actionVideo(true));
  };
  const turnOffVideo = () => {
    socketRef.current.emit('turn off video room', { roomId, userTurnOff: user.id });
    dispatch(actionVideo(false));
  };
  const flipCameraMobile = (facing) => {
    const facingNew = facing === 'user' ? 'environment' : 'user';
    // const track0 = localStream.getTracks().at(0);
    // const track1 = localStream.getTracks().at(1);
    // const constraints = track1.getConstraints();
    // constraints.facingMode = facingNew;
    // track1.applyConstraints(constraints);
    // localStream.getTracks().forEach((track) => {
    //   console.log('1', track.kind, track, track.getConstraints());
    // });
    // // stream.removeTrack(stream.getTracks().at(1));
    // userVideo.current.srcObject
    //   .getTracks()
    //   .at(1)
    //   .applyConstraints({ facingMode: 'environment' })
    //   .then(() => {
    //     localStream.getTracks().forEach((track) => {
    //       console.log('2', track.kind, track, track.getConstraints());
    //     });
    // socketRef.current.emit('flip camera', { roomId });
    // localStream.addTrack(track0);
    // localStream.addTrack(track1);
    // userVideo.current.srcObject = localStream;
    //   userVideo.current.srcObject.getTracks().forEach((track) => {
    //     console.log('3', track.kind, track, track.getConstraints());
    //   });
    // });

    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: facingNew
        },
        audio: true
      })
      .then((stream) => {
        setLocalStream(stream);
        socketRef.current.emit('flip camera', {
          roomId: room.id,
          socketId: me,
          userJoin: user
        });
        peersRef.current = [];
        userVideo.current.srcObject = stream;
        dispatch(actionFacingMode(facingNew));
      });
  };
  const replacePeer = (stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });
    peer.on('signal', (data) => {
      socketRef.current.emit('flip camera', {
        signal: data,
        roomId,
        socketIdFlip: me,
        userFlip: user
      });
    });
  };
  const replacePeerOther = (incomingSignal, callerID, userJoin) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: userVideo.current.srcObject
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return {
      peer,
      userJoin
    };
  };
  return (
    <RootStyle>
      <Box sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        <Typography sx={{ fontSize: '18px', color: 'gray', fontFamily: 'sans-serif' }}>
          Room Id: <b>{roomId}</b>
        </Typography>
        {room.id !== undefined && (
          <Typography sx={{ fontSize: '18px', color: 'gray', fontFamily: 'sans-serif' }}>
            Video call group: <b>{room.chatbox.name}</b>
          </Typography>
        )}
      </Box>
      {room.id !== undefined && (
        <Box sx={{ width: '100%', padding: ' 5px 20px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
            Host: {room.userCreate.username}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
            Created at : {moment(room.createdAt).format(`MM-DD-YYYY, h:mm a`)}
          </Typography>
        </Box>
      )}
      <BoxContent>
        <BoxLeft sx={{ width: '75%' }} container>
          {allPeers.map((peer, index) => (
            <Grid sx={{ padding: '5px' }} item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
              <Video index={index} peer={peer.peer} userJoin={peer.userJoin} />
            </Grid>
          ))}
        </BoxLeft>
        <BoxRight>
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
              sx={{ color: 'blue', marginRight: '10px' }}
            >
              <Icon
                style={{ width: '30px', height: '30px' }}
                icon="fluent:people-community-add-24-filled"
              />
            </IconButton>
            {audio ? (
              <IconButton onClick={turnOffAudio} sx={{ color: 'green', marginRight: '10px' }}>
                <Icon style={{ width: '30px', height: '30px' }} icon="bi:mic-fill" />
              </IconButton>
            ) : (
              <IconButton onClick={turnOnAudio} sx={{ color: 'green', marginRight: '10px' }}>
                <Icon style={{ width: '30px', height: '30px' }} icon="bi:mic-mute-fill" />
              </IconButton>
            )}
            {user.id === room.userCreate.id ? (
              <IconButton onClick={endCall} sx={{ color: 'red', marginRight: '20px' }}>
                <Icon
                  style={{ width: '30px', height: '30px' }}
                  icon="fluent:record-stop-16-filled"
                />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  socketRef.current.emit('expel member', {
                    roomId: room.id,
                    socketId: me,
                    userJoin: user
                  });
                }}
                sx={{ color: 'red', marginRight: '10px' }}
              >
                <Icon style={{ width: '30px', height: '30px' }} icon="fluent:sign-out-20-filled" />
              </IconButton>
            )}
            {video ? (
              <IconButton onClick={turnOffVideo} sx={{ color: 'orange' }}>
                <Icon style={{ width: '30px', height: '30px' }} icon="bi:camera-video-fill" />
              </IconButton>
            ) : (
              <IconButton onClick={turnOnVideo} sx={{ color: 'orange' }}>
                <Icon style={{ width: '30px', height: '30px' }} icon="bi:camera-video-off-fill" />
              </IconButton>
            )}
            {/* {isMobile && ( */}
            <Icon onClick={() => flipCameraMobile(facing)} icon="fa6-solid:camera-rotate" />
            {/* )} */}
          </BoxOptions>
          <VideoUser>
            <video
              muted={!audio}
              hidden={!video}
              style={{ width: '100%', height: '100%' }}
              ref={userVideo}
              autoPlay
              playsInline
            />
          </VideoUser>
        </BoxRight>
      </BoxContent>
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
