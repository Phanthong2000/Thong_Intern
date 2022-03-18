import React from 'react';
import { Box, Button, Card, IconButton, Modal, Stack, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { keyframes } from '@emotion/react';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { actionModalReceiving, actionStream } from '../../redux/actions/callAction';
import { answerCall, endCall } from '../../utils/wssConnection';
import { db } from '../../firebase-config';
import { actionGetAllChatSort, actionChatAddMessage } from '../../redux/actions/chatAction';

const anim = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.375;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;
const RootStyle = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '300px',
  height: '300px',
  textAlign: 'center',
  background: theme.palette.green,
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
const BoxRipple = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(2),
  border: `1px solid green`
}));
ModalReceivingVideoCall.prototype = {
  user: PropTypes.object
};
function ModalReceivingVideoCall({ user }) {
  const modalReceiving = useSelector((state) => state.call.modalReceiving);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const call = useSelector((state) => state.call.call);
  const name = useSelector((state) => state.call.name);
  const dispatch = useDispatch();
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
  const answerVideoCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        dispatch(actionStream(currentStream));
      })
      .then(() => {
        dispatch(actionModalReceiving(false));
        answerCall();
        navigate('/home/video-call');
      });
  };
  const declineCall = () => {
    const userFrom = usersSocket.find((user) => user.socketId === call.from);
    getChatbox(user.id, userFrom.userId).then((result) => {
      const message = {
        chatboxId: result.id,
        content: 'Video call',
        isRead: false,
        type: 'call',
        status: 'fail',
        isRestore: false,
        reaction: [],
        senderId: userFrom.userId,
        receiverId: user.id,
        createdAt: new Date().getTime()
      };
      console.log(message);
      addDoc(collection(db, 'messages'), message)
        .then((docRef) => {
          dispatch(actionChatAddMessage({ ...message, id: docRef.id }));
          updateDoc(doc(db, 'chatboxs', result.id), {
            updatedAt: new Date().getTime()
          }).then(() => {
            // endCall(userCall.socketId);
            dispatch(actionGetAllChatSort(user.id));
            // sendMessageSocket({ ...message, socketId: userCall.socketId });
            // stream.getTracks().forEach((track) => {
            //   track.stop();
            // });
            // navigate('/home/app');
            endCall(call.from);
            dispatch(actionModalReceiving(false));
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  return (
    <Modal open={modalReceiving} onClose={() => dispatch(actionModalReceiving(false))}>
      <RootStyle>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '20px' }}>
            {call.name} is calling
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <IconButton
              sx={{
                border: `1px solid green`,
                width: '70px',
                height: '70px',
                animation: `${anim} 3s ease forwards infinite`
              }}
            >
              <Icon
                style={{ color: '#fff', width: '40px', height: '40px' }}
                icon="bi:phone-vibrate-fill"
              />
            </IconButton>
          </Box>
          <Stack
            direction="row"
            sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
          >
            <IconButton
              onClick={answerVideoCall}
              sx={{ color: 'lightgreen', width: '50px', height: '50px', background: '#fff' }}
            >
              <Icon icon="icomoon-free:phone" />
            </IconButton>
            <IconButton
              onClick={declineCall}
              sx={{ color: 'red', width: '50px', height: '50px', background: '#fff' }}
            >
              <Icon icon="icomoon-free:phone-hang-up" />
            </IconButton>
          </Stack>
        </Box>
      </RootStyle>
    </Modal>
  );
}

export default ModalReceivingVideoCall;
