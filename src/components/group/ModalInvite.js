import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  Modal,
  Radio,
  styled,
  Typography
} from '@mui/material';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'smooth-scrollbar-react';
import { actionUserBackdrop } from '../../redux/actions/userAction';
import { db } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import { actionGroupModalInvite } from '../../redux/actions/groupAction';

const BoxModal = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1)
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '100%'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  width: '100%',
  background: 'lightgrey',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '30px',
  padding: '5px 20px'
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
function Friend({ friend, choose, unChoose }) {
  const modalInvite = useSelector((state) => state.group.modalInvite);
  const [userFriend, setUserFriend] = useState({});
  const [chosen, setChosen] = useState(false);
  const getUserFriend = () => {
    getDoc(doc(db, 'users', friend.friendId)).then((snapshot) => {
      setUserFriend({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getUserFriend();
    return () => null;
  }, []);
  const BoxFriend = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '5px 20px',
    justifyContent: 'space-between'
  }));
  const handleChoose = () => {
    if (chosen) {
      unChoose(friend.friendId);
    } else {
      choose(friend.friendId);
    }
    setChosen(!chosen);
  };
  if (modalInvite.group.members.includes(friend.friendId)) return null;
  return (
    <BoxFriend>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Avatar src={userFriend.avatar} />
        <Typography sx={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '16px' }}>
          {userFriend.username}
        </Typography>
      </Box>
      <Radio onClick={handleChoose} checked={chosen} />
    </BoxFriend>
  );
}
function ModalInvite() {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.call.socket);
  const socketRef = useRef();
  const user = useSelector((state) => state.user.user);
  const modalInvite = useSelector((state) => state.group.modalInvite);
  const [chooseFriends, setChooseFriends] = useState([]);
  const friends = useSelector((state) => state.user.friends);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const handleClose = () => {
    dispatch(
      actionGroupModalInvite({
        status: false,
        page: {}
      })
    );
  };
  const choose = (id) => {
    const data = chooseFriends;
    setChooseFriends([...data, id]);
  };
  const unChoose = (id) => {
    const data = chooseFriends;
    setChooseFriends(data.filter((choose) => choose !== id));
  };
  const invite = () => {
    socketRef.current = socket;
    const socketIds = [];
    chooseFriends.forEach((friend) => {
      const userCall = usersSocket.find((user) => user.userId === friend);
      if (userCall !== undefined && userCall.userId !== user.id) socketIds.push(userCall);
    });
    handleClose();
    dispatch(
      actionUserBackdrop({
        status: true,
        content: 'Invite friends'
      })
    );
    let count = 0;
    chooseFriends.forEach((choose) => {
      const notification = {
        senderIds: [user.id],
        receiverId: choose,
        content: `invited you to join group ${modalInvite.group.name}`,
        type: 'invite',
        groupId: modalInvite.group.id,
        isRead: false,
        action: 'like',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      addDoc(collection(db, 'notifications'), notification).then(() => {
        count += 1;
        if (count === chooseFriends.length) {
          console.log('ok');
          if (socketIds.length > 0) {
            socketRef.current.emit('invite join group', {
              socketIds,
              userInvite: user,
              group: modalInvite.group
            });
          }
          dispatch(
            actionUserBackdrop({
              status: false,
              content: 'Invite friends'
            })
          );
          dispatch(
            actionOpenSnackbar({
              status: true,
              content: 'Invite success',
              type: 'success'
            })
          );
        }
      });
    });
  };
  return (
    <Modal open={modalInvite.status} onClose={handleClose}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
            Invite to your friends join group {modalInvite.group.name}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Separate />
        <BoxContent>
          <BoxSearch>
            <Icon icon="fluent:search-32-filled" />
            <InputBase sx={{ marginLeft: '10px' }} placeholder="Search your friends" fullWidth />
          </BoxSearch>
          <Box sx={{ width: '100%', maxHeight: '300px', display: 'flex' }}>
            <Scrollbar>
              {friends.map((item, index) => (
                <Friend key={index} choose={choose} unChoose={unChoose} friend={item} />
              ))}
            </Scrollbar>
          </Box>
        </BoxContent>
        <Separate />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonInvite disabled={chooseFriends.length === 0} onClick={invite}>
            Invite
          </ButtonInvite>
        </Box>
      </BoxModal>
    </Modal>
  );
}

export default ModalInvite;
