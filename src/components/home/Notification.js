import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  Avatar,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import LinesEllipsis from 'react-lines-ellipsis';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { db } from '../../firebase-config';
import { actionGetBadgeNotifications } from '../../redux/actions/userAction';

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  height: '100px',
  maxHeight: '100px'
}));
const CreatedAt = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey
}));
Notification.prototype = {
  notification: PropTypes.object,
  user: PropTypes.object
};
function Notification({ notification }) {
  const [sender, setSender] = useState({});
  const [isRead, setIsRead] = useState(notification.isRead);
  const dispatch = useDispatch();
  const getSender = () => {
    if (notification.senderIds.length > 0) {
      getDoc(doc(db, 'users', notification.senderIds.at(notification.senderIds.length - 1))).then(
        (snapshot) => setSender(snapshot.data())
      );
    }
  };
  useEffect(() => {
    getSender();
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
      </Stack>
      {!isRead && <Icon icon="ci:dot-04-l" fontSize={30} color="#30ab78" />}
    </RootStyle>
  );
}
export default Notification;
