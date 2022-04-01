import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Divider, ListItemButton, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase-config';
import AvatarMutualFriend from '../../friend/AvatarMutualFriend';
import {
  confirmRequestAddFriendSocket,
  deleteRequestAddFriendSocket
} from '../../../utils/wssConnection';
import {
  actionGetAllFriendUser,
  actionGetAllNotifications,
  actionGetBadgeNotifications,
  actionUserDeleteFriendRequest
} from '../../../redux/actions/userAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '10px 0px'
}));
const ButtonSeeAll = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.green,
  fontWeight: 'bold'
}));
const ButtonManage = styled(Button)(({ theme }) => ({
  background: 'lightgrey',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#000',
  fontFamily: 'sans-serif',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  padding: '0px 20px',
  ':hover': {
    background: 'lightgrey'
  }
}));
const ButtonPromote = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#fff',
  background: theme.palette.green,
  textTransform: 'none',
  marginLeft: '10px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  marginRight: '10px',
  ':hover': {
    background: theme.palette.green
  },
  padding: '5px 50px'
}));
function BoxFriendRequests() {
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const dispatch = useDispatch();
  const [sender, setSender] = useState({});
  const [notification, setNotification] = useState({});
  const friendManual = useSelector((state) => state.user.friendManual);
  const [friendMutualUser, setFriendMutualUser] = useState([]);
  const [quantityMutualFriend, setQuantityMutualFriend] = useState(-1);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const navigate = useNavigate();
  const getAllFriendsSender = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', friendRequests.at(0).senderId),
        where('status', '==', true)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', friendRequests.at(0).senderId),
        where('status', '==', true)
      )
    );
    if (data1.empty && data2.empty) {
      setQuantityMutualFriend(0);
    }
    const contacts = [];
    data1.docs.forEach((contact) => {
      contacts.push(contact.data().receiverId);
    });
    data2.docs.forEach((contact) => {
      contacts.push(contact.data().senderId);
    });
    const temp = [];
    if (friendManual.length >= contacts.length) {
      contacts.forEach((friend) => {
        if (friendManual.includes(friend)) {
          temp.push(friend);
        }
      });
    } else {
      friendManual.forEach((friend) => {
        if (contacts.includes(friend)) {
          temp.push(friend);
        }
      });
    }
    setQuantityMutualFriend(temp.length);
    setFriendMutualUser(temp);
  };
  const getNotification = () => {
    getDocs(
      query(collection(db, 'notifications'), where('contactId', '==', friendRequests.at(0).id))
    ).then((snapshots) => {
      if (!snapshots.empty) {
        setNotification({
          ...snapshots.docs.at(0).data(),
          id: snapshots.docs.at(0).id
        });
      }
    });
  };
  const getSender = () => {
    getDoc(doc(db, 'users', friendRequests.at(0).senderId)).then((snapshot) => {
      setSender({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    if (friendRequests.length > 0) {
      getAllFriendsSender();
      getNotification();
      getSender();
    }
    return () => null;
  }, [friendRequests, friendManual]);
  const ManualFriend = () => {
    const Mutual = styled(Typography)(() => ({
      minHeight: '24px',
      fontFamily: 'inherit',
      color: 'gray'
    }));
    if (quantityMutualFriend === 0) return <Mutual> </Mutual>;
    if (quantityMutualFriend === 1)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AvatarMutualFriend mutualFriendId={friendMutualUser.at(0)} />
          <Mutual>1 manual friend</Mutual>
        </Box>
      );
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarMutualFriend zIndex={1} margin={0} mutualFriendId={friendMutualUser.at(0)} />
        <AvatarMutualFriend zIndex={2} margin={-1} mutualFriendId={friendMutualUser.at(1)} />
        <Mutual>{`${quantityMutualFriend} manual friend`}</Mutual>
      </Box>
    );
  };
  const deleteRequest = (e) => {
    e.stopPropagation();
    deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
      deleteDoc(doc(db, 'contacts', notification.contactId)).then(() => {
        const userSocket = usersSocket.find((user) => user.userId === sender.id);
        if (userSocket !== undefined)
          deleteRequestAddFriendSocket({
            id: notification.contactId,
            socketId: userSocket.socketId,
            senderId: notification.receiverId,
            receiverId: userSocket.userId
          });
        dispatch(actionGetBadgeNotifications(notification.receiverId));
        dispatch(actionGetAllNotifications(notification.receiverId));
        dispatch(actionUserDeleteFriendRequest(notification.contactId));
      });
    });
  };
  const confirmRequest = (e) => {
    e.stopPropagation();
    const userSocket = usersSocket.find((user) => user.userId === notification.senderIds[0]);
    deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
      updateDoc(doc(db, 'contacts', notification.contactId), { status: true }).then(() => {
        if (userSocket !== undefined)
          confirmRequestAddFriendSocket({
            id: notification.contactId,
            socketId: userSocket.socketId,
            senderId: notification.receiverId,
            receiverId: userSocket.userId
          });
        dispatch(actionGetBadgeNotifications(notification.receiverId));
        dispatch(actionGetAllNotifications(notification.receiverId));
        dispatch(actionUserDeleteFriendRequest(notification.contactId));
        dispatch(actionGetAllFriendUser(notification.receiverId));
      });
    });
  };
  const readNotification = () => {
    updateDoc(doc(db, 'notifications', notification.id), { isRead: true }).then(() => {
      dispatch(actionGetBadgeNotifications(notification.receiverId));
      dispatch(actionGetAllNotifications(notification.receiverId));
      navigate(`/home/other/${notification.senderIds[0]}`);
    });
  };
  if (quantityMutualFriend < 0) return null;
  return (
    <RootStyle onClick={readNotification}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          sx={{
            display: 'flex',
            fontFamily: 'sans-serif',
            color: 'gray',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Friend requests
        </Typography>
        <ButtonSeeAll>See all</ButtonSeeAll>
      </Box>
      <ListItemButton sx={{ padding: '10px 20px', display: 'flex', width: '100%' }}>
        <Avatar sx={{ width: '70px', height: '70px' }} src={sender.avatar} />
        <Box sx={{ marginLeft: '10px', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', fontFamily: 'sans-serif' }}>
              {sender.username}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{
                  color: !notification.isRead ? `#30ab78` : 'gray',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                {moment(notification.createdAt).fromNow(true)}
              </Typography>
              {!notification.isRead && <Icon style={{ color: '#30ab78' }} icon="ci:dot-02-s" />}
            </Box>
          </Box>
          <ManualFriend />
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <ButtonPromote onClick={confirmRequest}>Confirm</ButtonPromote>
            <ButtonManage onClick={deleteRequest}>Delete</ButtonManage>
          </Box>
        </Box>
      </ListItemButton>
      <Divider sx={{ marginTop: '10px' }} />
    </RootStyle>
  );
}

export default BoxFriendRequests;
