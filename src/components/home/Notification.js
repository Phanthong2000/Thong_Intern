import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Avatar, ListItem, ListItemButton, Stack, styled, Typography } from '@mui/material';
import { getDoc, doc } from 'firebase/firestore';
import LinesEllipsis from 'react-lines-ellipsis';
import moment from 'moment';
import { db } from '../../firebase-config';

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
  const getSender = () => {
    getDoc(doc(db, 'users', notification.senderId)).then((snapshot) => setSender(snapshot.data()));
  };
  useEffect(() => {
    getSender();
  }, []);
  return (
    <RootStyle>
      <Avatar src={sender.avatar} sx={{ width: '50px', height: '50px' }} />
      <Stack sx={{ marginLeft: '10px', width: '300px' }}>
        <LinesEllipsis
          text={
            <span>
              <b>{sender.username}</b> {notification.content}
            </span>
          }
          maxLine="3"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
        <CreatedAt sx={!notification.isRead ? { color: '#30ab78' } : null}>
          {moment(notification.createdAt).startOf('minutes').fromNow()}
        </CreatedAt>
      </Stack>
      <Icon icon="ci:dot-04-l" fontSize={30} color="#30ab78" />
    </RootStyle>
  );
}
export default Notification;
