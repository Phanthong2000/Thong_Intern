import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, Divider, IconButton, Modal, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';
import PropTypes from 'prop-types';
import { doc, getDoc } from 'firebase/firestore';
import {
  actionModalAddMemberToRoom,
  actionSetSocketIdsJoinRoom
} from '../../redux/actions/callAction';
import { db } from '../../firebase-config';
import MemberAddToRoom from './MemberAddToRoom';

const RootStyle = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  background: theme.palette.background,
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
const ButtonInvite = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  fontFamily: 'sans-serif',
  color: '#fff',
  background: theme.palette.green,
  ':hover': {
    background: theme.palette.green
  }
}));
ModalAddMemberToRoom.prototype = {
  user: PropTypes.object
};
function ModalAddMemberToRoom({ user }) {
  const socketRef = useRef();
  const [members, setMembers] = useState([]);
  const dispatch = useDispatch();
  const modalAddMemberToRoom = useSelector((state) => state.call.modalAddMemberToRoom);
  const allPeers = useSelector((state) => state.call.allPeers);
  const socket = useSelector((state) => state.call.socket);
  const socketIdsJoinRoom = useSelector((state) => state.call.socketIdsJoinRoom);
  const handleClose = () => {
    dispatch(actionSetSocketIdsJoinRoom([]));
    dispatch(
      actionModalAddMemberToRoom({
        status: false,
        room: {}
      })
    );
  };
  const getRoom = () => {
    getDoc(doc(db, 'rooms', modalAddMemberToRoom.room.id)).then((snapshot) => {
      setMembers(snapshot.data().members);
    });
  };
  useEffect(() => {
    getRoom();
    return () => null;
  }, []);
  const invite = () => {
    socketRef.current = socket;
    socketRef.current.emit('invite join room', {
      socketIds: socketIdsJoinRoom,
      name: user.username,
      roomId: modalAddMemberToRoom.room.id
    });
    handleClose();
  };
  return (
    <Modal open={modalAddMemberToRoom.status} onClose={handleClose}>
      <RootStyle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
            Add members to room
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Box sx={{ height: '450px', maxHeight: '450px', display: 'flex' }}>
          <Scrollbar alwaysShowTracks>
            <Divider />
            <Box>
              {modalAddMemberToRoom.room.chatbox.members.map(
                (item, index) =>
                  item !== user.id && <MemberAddToRoom user={user} key={index} memberId={item} />
              )}
            </Box>
          </Scrollbar>
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <ButtonInvite onClick={invite}>Invite</ButtonInvite>
        </Box>
      </RootStyle>
    </Modal>
  );
}

export default ModalAddMemberToRoom;
