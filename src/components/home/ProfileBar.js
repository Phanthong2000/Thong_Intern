import React, { useEffect, useState } from 'react';
import { styled, Stack, Avatar, IconButton, Badge } from '@mui/material';
import {
  Notifications,
  ChatBubbleOutline,
  ChatBubble,
  NotificationsNone,
  ArrowDropUp
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  actionUserOpenProfile,
  actionUserCloseProfile,
  actionUserCloseNotifications,
  actionUserOpenNotifications
} from '../../redux/actions/userAction';
import BoxProfile from './BoxProfile';
import BoxNotifications from './BoxNotifications';

const RootStyle = styled(Stack)(() => ({
  display: 'flex'
}));
const IsOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  right: 5,
  bottom: 5,
  width: '15px',
  height: '15px',
  color: theme.palette.green
}));
ProfileBar.prototype = {
  user: PropTypes.object
};
function ProfileBar({ user }) {
  const isOpeningProfile = useSelector((state) => state.user.isOpeningProfile);
  const isOpeningNotifications = useSelector((state) => state.user.isOpeningNotifications);
  const dispatch = useDispatch();
  const testBadge = 0;
  const openProfileBox = () => {
    dispatch(actionUserOpenProfile());
  };
  const closeProfileBox = () => {
    dispatch(actionUserCloseProfile());
  };
  const openNotifications = () => {
    if (isOpeningNotifications) dispatch(actionUserCloseNotifications());
    else dispatch(actionUserOpenNotifications());
  };
  return (
    <RootStyle direction="row" spacing={3}>
      <IconButton size="large" aria-label="show 4 new mails" color="inherit">
        <Badge badgeContent={testBadge >= 1 ? 1 : null} color="error">
          {testBadge >= 1 ? (
            <ChatBubble sx={{ color: '#30ab78' }} />
          ) : (
            <ChatBubbleOutline sx={{ color: '#30ab78' }} />
          )}
        </Badge>
      </IconButton>
      <IconButton
        onClick={() => openNotifications()}
        size="large"
        aria-label="show 4 new mails"
        color="inherit"
      >
        <Badge badgeContent={testBadge >= 1 ? 1 : null} color="error">
          {testBadge >= 1 ? (
            <Notifications sx={{ color: '#30ab78' }} />
          ) : (
            <NotificationsNone sx={{ color: '#30ab78' }} />
          )}
        </Badge>
      </IconButton>
      {isOpeningProfile ? (
        <IconButton sx={{ background: 'gray' }} onClick={() => closeProfileBox()}>
          <ArrowDropUp sx={{ color: '#000', fontSize: '35px' }} />
        </IconButton>
      ) : (
        <IconButton onClick={() => openProfileBox()}>
          <IsOnline icon="akar-icons:circle-fill">s</IsOnline>
          <Avatar src={user.avatar} />
        </IconButton>
      )}
      {isOpeningProfile ? <BoxProfile user={user} /> : null}
      {isOpeningNotifications ? <BoxNotifications user={user} /> : null}
    </RootStyle>
  );
}

export default ProfileBar;