import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Stack,
  styled,
  Typography,
  Button,
  Popover,
  Popper,
  Skeleton
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  actionGetAllFriendOther,
  actionGetAllFriendUser,
  actionGetAllNotifications,
  actionGetBadgeNotifications,
  actionGetContact,
  actionUserContactUserAndOther,
  actionUserDeleteFriendRequest
} from '../../redux/actions/userAction';
import AvatarFriend from '../profile/AvatarFriend';
import {
  addFriendSocket,
  confirmRequestAddFriendSocket,
  deleteRequestAddFriendSocket,
  unFriendSocket
} from '../../utils/wssConnection';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '60%',
  marginTop: '10px',
  background: '#fff',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center'
  }
}));
const WrapperInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const AvatarUser = styled(IconButton)(() => ({
  width: '20%'
}));
const AvatarImage = styled(Avatar)(() => ({
  width: '100px',
  height: '100px',
  border: '2px solid #30ab78',
  cursor: 'pointer'
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '100px',
  height: '100px'
}));
const InfoUser = styled(Stack)(({ theme }) => ({
  width: '78%',
  marginLeft: '2%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '0px'
  }
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '22px',
  fontFamily: 'sans-serif'
}));
const TotalFriend = styled(Typography)(() => ({
  color: 'grey',
  fontSize: '18px',
  fontFamily: 'sans-serif'
}));
const WrapperButtonContact = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const BoxAvatarFriends = styled(Box)(({ theme }) => ({
  width: '35%',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));
const BoxButtonContact = styled(Box)(({ theme }) => ({
  width: '65%',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const ButtonContact = styled(Button)(({ theme }) => ({
  color: '#000',
  textDecoration: 'none',
  background: theme.palette.background,
  padding: theme.spacing(0.5, 2, 0.5),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold'
}));
const ButtonChat = styled(Button)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  background: theme.palette.green,
  padding: theme.spacing(0.5, 2, 0.5),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  marginLeft: '10px',
  ':hover': {
    background: theme.palette.green
  }
}));
Information.prototype = {
  user: PropTypes.object
};
function Information({ user }) {
  const { pathname } = useLocation();
  const socket = useSelector((state) => state.call.socket);
  const socketRef = useRef();
  const { id } = useParams();
  const [other, setOther] = useState({});
  const contact = useSelector((state) => state.user.contact);
  const dispatch = useDispatch();
  const friendsOther = useSelector((state) => state.user.friendsOther);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      setOther({ ...snapshot.data(), id });
    });
    if (socket.id !== undefined) {
      socketRef.current = socket;
      socketRef.current.on('deleteRequestAddFriend', (data) => {
        if (data.senderId === id) {
          dispatch(actionGetContact(user.id, id));
        }
      });
      socketRef.current.on('addFriend', (data) => {
        if (data.senderId === id) {
          dispatch(actionGetContact(user.id, id));
        }
      });
      socketRef.current.on('confirmRequestAddFriend', (data) => {
        if (data.senderId === id) {
          dispatch(actionGetContact(user.id, id));
          dispatch(actionGetAllFriendOther(id));
        }
      });
      socketRef.current.on('unFriend', (data) => {
        if (data.senderId === id) {
          dispatch(actionGetContact(user.id, id));
          dispatch(actionGetAllFriendOther(id));
        }
      });
    }
    dispatch(actionGetContact(user.id, id));
    return () => null;
  }, [user, pathname, socket]);
  const getTotalFriends = () => {
    if (friendsOther.length < 2) return `${friendsOther.length} Friend`;
    return `${friendsOther.length} Friends`;
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const idPopover = open ? 'simple-popover' : undefined;
  const confirmRequest = () => {
    const userSocket = usersSocket.find((user) => user.userId === id);
    getDocs(query(collection(db, 'notifications'), where('contactId', '==', contact.id))).then(
      (snapshots) => {
        if (!snapshots.empty) {
          deleteDoc(doc(db, 'notifications', snapshots.docs.at(0).id)).then(() => {
            updateDoc(doc(db, 'contacts', contact.id), { status: true }).then(() => {
              dispatch(
                actionUserContactUserAndOther({
                  ...contact,
                  status: 'friend',
                  createdAt: new Date().getTime()
                })
              );
              if (userSocket !== undefined)
                confirmRequestAddFriendSocket({
                  id: contact.id,
                  socketId: userSocket.socketId,
                  senderId: user.id,
                  receiverId: other.id
                });
              handleClose();
              dispatch(actionUserDeleteFriendRequest(contact.id));
              dispatch(actionGetAllFriendUser(user.id));
              dispatch(actionGetBadgeNotifications(user.id));
              dispatch(actionGetAllNotifications(user.id));
              dispatch(actionGetAllFriendOther(id));
            });
          });
        }
      }
    );
  };
  const deleteRequest = () => {
    const userSocket = usersSocket.find((user) => user.userId === id);
    getDocs(query(collection(db, 'notifications'), where('contactId', '==', contact.id))).then(
      (snapshots) => {
        if (!snapshots.empty) {
          deleteDoc(doc(db, 'notifications', snapshots.docs.at(0).id)).then(() => {
            deleteDoc(doc(db, 'contacts', contact.id)).then((docRef) => {
              if (userSocket !== undefined)
                deleteRequestAddFriendSocket({
                  id: contact.id,
                  socketId: userSocket.socketId,
                  senderId: user.id,
                  receiverId: other.id
                });
              dispatch(
                actionUserContactUserAndOther({
                  ...contact,
                  status: 'none'
                })
              );
              handleClose();
              dispatch(actionGetBadgeNotifications(user.id));
              dispatch(actionGetAllNotifications(user.id));
              dispatch(actionUserDeleteFriendRequest(contact.id));
            });
          });
        }
      }
    );
  };
  const unFriend = () => {
    const userSocket = usersSocket.find((user) => user.userId === id);
    deleteDoc(doc(db, 'contacts', contact.id)).then(() => {
      if (userSocket !== undefined)
        unFriendSocket({
          id: contact.id,
          socketId: userSocket.socketId,
          senderId: user.id,
          receiverId: other.id
        });
      handleClose();
      dispatch(
        actionUserContactUserAndOther({
          ...contact,
          status: 'none'
        })
      );
      dispatch(actionGetAllFriendUser(user.id));
      dispatch(actionGetAllFriendOther(id));
    });
  };
  const addFriend = () => {
    const userSocket = usersSocket.find((user) => user.userId === id);
    addDoc(collection(db, 'contacts'), {
      senderId: user.id,
      receiverId: other.id,
      status: false,
      createdAt: new Date().getTime()
    }).then((docRef) => {
      const notification = {
        senderIds: [user.id],
        receiverId: id,
        content: `sent you a friend request`,
        type: 'invite',
        contactId: docRef.id,
        isRead: false,
        action: 'addFriend',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      addDoc(collection(db, 'notifications'), notification).then((snapshot) => {
        if (userSocket !== undefined) {
          const data = {
            socketId: userSocket.socketId,
            senderId: user.id,
            receiverId: other.id,
            status: false,
            createdAt: new Date().getTime(),
            id: docRef.id
          };
          addFriendSocket(data);
        }
        dispatch(
          actionUserContactUserAndOther({
            ...contact,
            status: 'sent',
            id: docRef.id
          })
        );
      });
    });
  };
  const BoxRespond = () => {
    const RootStyle = styled(Card)(({ theme }) => ({
      background: theme.palette.background,
      padding: theme.spacing(2, 1, 2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '10px',
      [theme.breakpoints.down('lg')]: {
        display: 'block'
      }
    }));
    const ButtonConfirmRequest = styled(Button)(({ theme }) => ({
      fontFamily: 'inherit',
      background: theme.palette.green,
      color: '#fff',
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      ':hover': {
        background: theme.palette.green
      }
    }));
    const ButtonDeleteRequest = styled(Button)(({ theme }) => ({
      fontFamily: 'inherit',
      background: 'lightgray',
      color: '#000',
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      marginLeft: '5px',
      ':hover': {
        background: 'lightgray'
      }
    }));
    if (contact.status === 'received')
      return (
        <RootStyle>
          <Typography
            sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}
          >{`${other.username} sent you a friend request`}</Typography>
          <Box>
            <ButtonConfirmRequest onClick={confirmRequest}>Confirm request</ButtonConfirmRequest>
            <ButtonDeleteRequest onClick={deleteRequest}>Delete request</ButtonDeleteRequest>
          </Box>
        </RootStyle>
      );
    return null;
  };
  const GetBoxAvatarFriend = () => {
    if (friendsOther.length <= 4) {
      const temp = friendsOther.slice(0, friendsOther.length);
      return (
        <BoxAvatarFriends>
          {temp.map((item, index) => (
            <AvatarFriend key={index} friend={item} index={index} />
          ))}
        </BoxAvatarFriends>
      );
    }
    const temp = friendsOther.slice(0, 3);
    return (
      <BoxAvatarFriends>
        {temp.map((item, index) => (
          <AvatarFriend key={index} friend={item} index={index} />
        ))}
        <Icon
          style={{
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            marginLeft: '-10px',
            color: 'grey'
          }}
          icon="mdi:dots-horizontal-circle"
        />
      </BoxAvatarFriends>
    );
  };
  return (
    <RootStyle>
      <WrapperInfo>
        <AvatarUser sx={{ '&:hover': { backgroundColor: 'transparent' } }} aria-label="Delete">
          {user.id === undefined ? (
            <SkeletonAvatar variant="circular" />
          ) : (
            <AvatarImage onClick={() => console.log('avatar')} src={other.avatar} />
          )}
        </AvatarUser>
        <InfoUser>
          {user.id === undefined ? (
            <Skeleton variant="text" sx={{ width: '150px', height: '33px' }} />
          ) : (
            <Username>{other.username}</Username>
          )}
          <TotalFriend>{getTotalFriends()}</TotalFriend>
          <WrapperButtonContact>
            <GetBoxAvatarFriend />
            <BoxButtonContact>
              {contact.status === 'friend' ? (
                <>
                  <ButtonContact
                    onClick={handleClick}
                    startIcon={<Icon icon="bx:bxs-user-check" />}
                  >
                    Friend
                  </ButtonContact>
                  <Popover
                    id={idPopover}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <ButtonContact onClick={unFriend} startIcon={<Icon icon="bx:bxs-user-x" />}>
                      Unfriend
                    </ButtonContact>
                  </Popover>
                </>
              ) : null}
              {contact.status === 'received' ? (
                <>
                  <ButtonContact
                    onClick={handleClick}
                    startIcon={<Icon icon="bx:bxs-user-check" />}
                  >
                    Respond
                  </ButtonContact>
                  <Popover
                    id={idPopover}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <Stack>
                      <ButtonContact onClick={confirmRequest}>Confirm request</ButtonContact>
                      <ButtonContact onClick={deleteRequest}>Delete request</ButtonContact>
                    </Stack>
                  </Popover>
                </>
              ) : null}
              {contact.status === 'sent' ? (
                <ButtonContact
                  onClick={deleteRequest}
                  startIcon={<Icon icon="bx:bxs-user-check" />}
                >
                  Remove
                </ButtonContact>
              ) : null}
              {contact.status === 'none' ? (
                <ButtonContact onClick={addFriend} startIcon={<Icon icon="bx:bxs-user-plus" />}>
                  Add friend
                </ButtonContact>
              ) : null}
              <ButtonChat
                onClick={() => console.log(contact)}
                startIcon={<Icon icon="bi:chat-left-fill" />}
              >
                Chat
              </ButtonChat>
            </BoxButtonContact>
          </WrapperButtonContact>
        </InfoUser>
      </WrapperInfo>
      <BoxRespond />
    </RootStyle>
  );
}

export default Information;
