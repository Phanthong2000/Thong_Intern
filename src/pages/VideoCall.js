import { Box, Card, styled, Typography, Stack, Button, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';
import { Icon } from '@iconify/react';
import { addDoc, collection, updateDoc, doc, getDocs, where, query } from 'firebase/firestore';
import { actionChatAddMessage, actionGetAllChatSort } from '../redux/actions/chatAction';
import { actionAudio, actionStream, actionVideo } from '../redux/actions/callAction';
import LocalVideo from '../components/video/LocalVideo';
import RemoteVideo from '../components/video/RemoteVideo';
import {
  callUser,
  endCall,
  videoOther,
  missCall,
  sendMessageSocket,
  audioOther
} from '../utils/wssConnection';
import { db } from '../firebase-config';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  marginTop: '60px',
  width: '100%',
  background: theme.palette.background,
  textAlign: 'center',
  padding: theme.spacing(2, 2, 2),
  minHeight: `${heightScreen}px`
}));
const ButtonOptions = styled(IconButton)(({ theme }) => ({
  width: '60px',
  height: '60px'
}));
const IconOptions = styled(Icon)(({ theme }) => ({
  color: theme.palette.green,
  width: '35px',
  height: '35px'
}));
function VideoCall({ user }) {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.call.me);
  const stream = useSelector((state) => state.call.stream);
  const callAccepted = useSelector((state) => state.call.callAccepted);
  const remoteStream = useSelector((state) => state.call.remoteStream);
  const callEnded = useSelector((state) => state.call.callEnded);
  const chatbox = useSelector((state) => state.chat.chatbox);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const call = useSelector((state) => state.call.call);
  const audio = useSelector((state) => state.call.audio);
  const video = useSelector((state) => state.call.video);
  const startCount = useSelector((state) => state.call.startCount);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState({});
  const navigate = useNavigate();
  const getChatbox = async (userId, userFromId) => {
    const data1 = await getDocs(
      query(
        collection(db, 'chatboxs'),
        where('user1', '==', userId),
        where('user2', '==', userFromId)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'chatboxs'),
        where('user1', '==', userFromId),
        where('user2', '==', userId)
      )
    );
    if (!data1.empty) {
      const result = {
        ...data1.docs.at(0).data(),
        id: data1.docs.at(0).id
      };
      return result;
    }
    if (!data2.empty) {
      const result = {
        ...data2.docs.at(0).data(),
        id: data2.docs.at(0).id
      };
      return result;
    }
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video, audio })
      .then((currentStream) => {
        dispatch(actionStream(currentStream));
      })
      .then(() => {
        const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
        callUser(userCall.socketId, user.username);
      })
      .catch((err) => {
        console.log('error occured when trying to get an access to get local stream');
        console.log(err);
      });
    return () => null;
  }, []);
  useEffect(() => {
    if (count === 1) {
      navigate('/home/app');
      window.location.reload();
    }
    setCount(1);
    return () => {
      setCount(0);
    };
  }, [callEnded]);
  const endCallVideo = () => {
    if (!callAccepted) {
      const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
      const message = {
        chatboxId: chatbox.id,
        content: 'Video call',
        isRead: false,
        type: 'call',
        status: 'fail',
        isRestore: false,
        reaction: [],
        senderId: user.id,
        receiverId: chatbox.user.id,
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message)
        .then((docRef) => {
          dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
          updateDoc(doc(db, 'chatboxs', chatbox.id), {
            updatedAt: new Date().getTime()
          }).then(() => {
            missCall(userCall.socketId);
            navigate('/home/app');
            window.location.reload();
            dispatch(actionGetAllChatSort(user.id));
            sendMessageSocket({ ...message, socketId: userCall.socketId });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
      if (userCall === undefined) {
        const userFrom = usersSocket.find((user) => user.socketId === call.from);
        getChatbox(user.id, userFrom.userId).then((result) => {
          const message = {
            chatboxId: result.id,
            content: 'Video chat',
            isRead: false,
            type: 'call',
            status: 'pass',
            isRestore: false,
            time: time.time,
            reaction: [],
            senderId: userFrom.userId,
            receiverId: user.id,
            createdAt: new Date().getTime()
          };
          addDoc(collection(db, 'messages'), message)
            .then((docRef) => {
              dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
              updateDoc(doc(db, 'chatboxs', result.id), {
                updatedAt: new Date().getTime()
              }).then(() => {
                // endCall(userCall.socketId);
                // dispatch(actionGetAllChatSort(user.id));
                // sendMessageSocket({ ...message, socketId: userCall.socketId });
                // stream.getTracks().forEach((track) => {
                //   track.stop();
                // });
                // navigate('/home/app');
                endCall(call.from);
                navigate('/home/app');
                window.location.reload();
              });
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        const message = {
          chatboxId: chatbox.id,
          content: 'Video chat',
          isRead: false,
          type: 'call',
          status: 'pass',
          isRestore: false,
          time: time.time,
          reaction: [],
          senderId: user.id,
          receiverId: chatbox.user.id,
          createdAt: new Date().getTime()
        };
        addDoc(collection(db, 'messages'), message)
          .then((docRef) => {
            dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
            updateDoc(doc(db, 'chatboxs', chatbox.id), {
              updatedAt: new Date().getTime()
            }).then(() => {
              endCall(userCall.socketId);
              // dispatch(actionGetAllChatSort(user.id));
              // sendMessageSocket({ ...message, socketId: userCall.socketId });
              // stream.getTracks().forEach((track) => {
              //   track.stop();
              // });
              navigate('/home/app');
              window.location.reload();
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  const turnOnAudio = () => {
    const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
    if (userCall === undefined) {
      audioOther({ socketId: call.from, status: true });
    } else {
      audioOther({ socketId: userCall.socketId, status: true });
    }
    dispatch(actionAudio(true));
  };
  const turnOffAudio = () => {
    const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
    if (userCall === undefined) {
      audioOther({ socketId: call.from, status: false });
    } else {
      audioOther({ socketId: userCall.socketId, status: false });
    }
    dispatch(actionAudio(false));
  };
  const turnOnVideo = () => {
    const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
    if (userCall === undefined) {
      videoOther({ socketId: call.from, status: true });
    } else {
      videoOther({ socketId: userCall.socketId, status: true });
    }
    dispatch(actionVideo(true));
  };
  const turnOffVideo = () => {
    const userCall = usersSocket.find((user) => user.userId === chatbox.user.id);
    if (userCall === undefined) {
      videoOther({ socketId: call.from, status: false });
    } else {
      videoOther({ socketId: userCall.socketId, status: false });
    }
    dispatch(actionVideo(false));
  };
  return (
    <RootStyle>
      <Typography sx={{ fontSize: '30px' }}>Video Call</Typography>
      <Stack sx={{ width: '100%', justifyContent: 'space-between' }} direction="row">
        <LocalVideo />
        {callAccepted && <RemoteVideo />}
      </Stack>
      {startCount ? (
        <Timer onTimeUpdate={setTime} active duration={null}>
          <Timecode />
        </Timer>
      ) : (
        <Typography>Waiting</Typography>
      )}
      {callEnded && <Typography>Ended</Typography>}
      <Stack direction="row" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {audio ? (
          <ButtonOptions onClick={turnOffAudio}>
            <IconOptions icon="ant-design:audio-filled" />
          </ButtonOptions>
        ) : (
          <ButtonOptions onClick={turnOnAudio}>
            <IconOptions icon="ant-design:audio-muted-outlined" />
          </ButtonOptions>
        )}
        <IconButton sx={{ margin: '0px 50px' }} onClick={endCallVideo}>
          <Icon
            style={{ color: 'red', width: '50px', height: '50px' }}
            icon="icomoon-free:phone-hang-up"
          />
        </IconButton>
        {video ? (
          <ButtonOptions onClick={turnOffVideo}>
            <IconOptions icon="bi:camera-video-fill" />
          </ButtonOptions>
        ) : (
          <ButtonOptions onClick={turnOnVideo}>
            <IconOptions icon="bi:camera-video-off" />
          </ButtonOptions>
        )}
      </Stack>
    </RootStyle>
  );
}

export default VideoCall;
