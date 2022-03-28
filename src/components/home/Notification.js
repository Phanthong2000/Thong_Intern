import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  Button,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import LinesEllipsis from 'react-lines-ellipsis';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import {
  actionGetAllFriendOther,
  actionGetAllFriendUser,
  actionGetAllNotifications,
  actionGetBadgeNotifications,
  actionGetContact,
  actionUserAddFriendRequest,
  actionUserCloseNotifications,
  actionUserDeleteFriendRequest
} from '../../redux/actions/userAction';
import {
  actionGetAllInvites,
  actionGetAllPages,
  actionGetLikedPages
} from '../../redux/actions/pageAction';
import {
  actionGetAllGroups,
  actionGetGroupsYouJoined,
  actionGetPostsAllGroup
} from '../../redux/actions/groupAction';
import {
  confirmRequestAddFriendSocket,
  deleteRequestAddFriendSocket
} from '../../utils/wssConnection';

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  height: '100%'
}));
const CreatedAt = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey
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
Notification.prototype = {
  notification: PropTypes.object
};
function Notification({ notification }) {
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const { pathname } = useLocation();
  const [sender, setSender] = useState({});
  const [isRead, setIsRead] = useState(notification.isRead);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState({});
  const [group, setGroup] = useState({});
  const getPage = () => {
    getDoc(doc(db, 'pages', notification.pageId)).then((snapshot) => {
      setPage({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  const getGroup = () => {
    getDoc(doc(db, 'groups', notification.groupId)).then((snapshot) => {
      setGroup({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  const getSender = () => {
    if (notification.senderIds.length > 0) {
      getDoc(doc(db, 'users', notification.senderIds.at(notification.senderIds.length - 1))).then(
        (snapshot) => setSender(snapshot.data())
      );
    }
  };
  useEffect(() => {
    getSender();
    if (notification.pageId) getPage();
    if (notification.groupId) getGroup();
    return () => null;
  }, []);
  const checkUsernameSent = () => {
    if (notification.senderIds.length === 1) return `${sender.username}`;
    if (notification.senderIds.length === 2) return `${sender.username} and 1 other`;
    return `${sender.username} and ${notification.senderIds.length - 1} others`;
  };
  const readNotification = () => {
    updateDoc(doc(db, 'notifications', notification.id), { isRead: true }).then(() => {
      setIsRead(true);
      dispatch(actionGetBadgeNotifications(notification.receiverId));
      dispatch(actionGetAllNotifications(notification.receiverId));
      if (notification.postId) navigate(`/home/post/${notification.postId}`);
      if (notification.pageId) navigate(`/home/pages/invites`);
      if (notification.groupId) navigate(`/home/groups/${notification.groupId}`);
      if (notification.contactId) navigate(`/home/other/${notification.senderIds[0]}`);
      dispatch(actionUserCloseNotifications());
    });
  };
  const accept = (e) => {
    e.stopPropagation();
    deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
      acceptInvite();
    });
  };
  const acceptInvite = () => {
    const pageNew = {
      ...page,
      likes: [...page.likes, notification.receiverId],
      followers: [...page.followers, notification.receiverId]
    };
    updateDoc(doc(db, 'invites', notification.inviteId), {
      status: true
    }).then(() => {
      updateDoc(doc(db, 'pages', page.id), pageNew).then((snapshot) => {
        dispatch(actionGetAllPages(notification.receiverId));
        dispatch(actionGetLikedPages(notification.receiverId));
        dispatch(actionGetAllInvites(notification.receiverId));
        dispatch(actionUserCloseNotifications());
        dispatch(actionGetBadgeNotifications(notification.receiverId));
        dispatch(actionGetAllNotifications(notification.receiverId));
      });
    });
  };
  const decline = (e) => {
    e.stopPropagation();
    deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
      deleteInvite();
    });
  };
  const deleteInvite = () => {
    updateDoc(doc(db, 'invites', notification.inviteId), {
      status: true
    }).then(() => {
      dispatch(actionGetAllInvites(notification.receiverId));
      dispatch(actionUserCloseNotifications());
      dispatch(actionGetBadgeNotifications(notification.receiverId));
      dispatch(actionGetAllNotifications(notification.receiverId));
    });
  };
  const declineGroup = (e) => {
    e.stopPropagation();
    deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
      dispatch(actionUserCloseNotifications());
      dispatch(actionGetBadgeNotifications(notification.receiverId));
      dispatch(actionGetAllNotifications(notification.receiverId));
    });
  };
  const acceptGroup = (e) => {
    e.stopPropagation();
    const groupNew = {
      ...group,
      members: [...group.members, notification.receiverId]
    };
    updateDoc(doc(db, 'groups', group.id), groupNew).then(() => {
      deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
        dispatch(actionUserCloseNotifications());
        dispatch(actionGetBadgeNotifications(notification.receiverId));
        dispatch(actionGetAllNotifications(notification.receiverId));
        dispatch(actionGetAllGroups(notification.receiverId));
        dispatch(actionGetGroupsYouJoined(notification.receiverId));
        dispatch(actionGetPostsAllGroup(notification.receiverId));
      });
    });
  };
  const deleteRequest = (e) => {
    e.stopPropagation();
    deleteDoc(doc(db, 'notifications', notification.id)).then(() => {
      deleteDoc(doc(db, 'contacts', notification.contactId)).then(() => {
        const userSocket = usersSocket.find((user) => user.userId === notification.senderIds[0]);
        if (userSocket !== undefined)
          deleteRequestAddFriendSocket({
            id: notification.contactId,
            socketId: userSocket.socketId,
            senderId: notification.receiverId,
            receiverId: userSocket.userId
          });
        if (pathname === `/home/other/${notification.senderIds[0]}`) {
          dispatch(actionGetContact(notification.receiverId, notification.senderIds[0]));
        }
        dispatch(actionUserCloseNotifications());
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
        if (pathname === `/home/other/${notification.senderIds[0]}`) {
          dispatch(actionGetContact(notification.receiverId, notification.senderIds[0]));
          dispatch(actionGetAllFriendOther(notification.senderIds[0]));
        }
        dispatch(actionUserCloseNotifications());
        dispatch(actionGetBadgeNotifications(notification.receiverId));
        dispatch(actionGetAllNotifications(notification.receiverId));
        dispatch(actionUserDeleteFriendRequest(notification.contactId));
        dispatch(actionGetAllFriendUser(notification.receiverId));
      });
    });
  };
  if (notification.senderIds.length <= 0) return null;
  return (
    <RootStyle onClick={readNotification}>
      {sender.avatar === undefined ? (
        <Skeleton variant="circular" sx={{ width: '50px', height: '50px' }} />
      ) : (
        <Avatar src={sender.avatar} sx={{ width: '50px', height: '50px' }} />
      )}
      <Stack sx={{ marginLeft: '10px', width: '300px' }}>
        {sender.username === undefined ? (
          <Skeleton variant="text" sx={{ width: '100px', height: '24px' }} />
        ) : (
          <LinesEllipsis
            text={
              <span>
                <b>{checkUsernameSent()}</b> {notification.content}
              </span>
            }
            maxLine="3"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        )}
        <CreatedAt sx={!isRead ? { color: '#30ab78' } : null}>
          {moment(notification.updatedAt).startOf('minutes').fromNow()}
        </CreatedAt>
        {notification.pageId && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ButtonPromote onClick={(e) => accept(e)}>Accept</ButtonPromote>
            <ButtonManage onClick={(e) => decline(e)}>Decline</ButtonManage>
          </Box>
        )}
        {notification.groupId && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ButtonPromote onClick={(e) => acceptGroup(e)}>Accept</ButtonPromote>
            <ButtonManage onClick={(e) => declineGroup(e)}>Decline</ButtonManage>
          </Box>
        )}
        {notification.contactId && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ButtonPromote onClick={(e) => confirmRequest(e)}>Confirm</ButtonPromote>
            <ButtonManage onClick={(e) => deleteRequest(e)}>Delete</ButtonManage>
          </Box>
        )}
      </Stack>
      {!isRead && <Icon icon="ci:dot-04-l" fontSize={30} color="#30ab78" />}
    </RootStyle>
  );
}
export default Notification;
