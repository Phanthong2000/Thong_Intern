import React from 'react';
import { styled, Stack, Avatar, IconButton, Badge } from '@mui/material';
import {
  Notifications,
  ChatBubbleOutline,
  ChatBubble,
  NotificationsNone,
  ArrowDropUp
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { actionUserOpenProfile, actionUserCloseProfile } from '../../redux/actions/userAction';
import BoxProfile from './BoxProfile';

const RootStyle = styled(Stack)(({ theme }) => ({
  display: 'flex'
}));
function ProfileBar() {
  const isOpeningProfile = useSelector((state) => state.user.isOpeningProfile);
  const dispatch = useDispatch();
  const testBadge = 0;
  const openProfileBox = () => {
    dispatch(actionUserOpenProfile());
  };
  const closeProfileBox = () => {
    dispatch(actionUserCloseProfile());
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
      <IconButton size="large" aria-label="show 4 new mails" color="inherit">
        <Badge badgeContent={testBadge >= 1 ? 1 : null} color="error">
          {testBadge >= 1 ? (
            <Notifications sx={{ color: '#30ab78' }} />
          ) : (
            <NotificationsNone sx={{ color: '#30ab78' }} />
          )}
        </Badge>
      </IconButton>
      <IconButton>
        <Avatar
          onClick={() => openProfileBox()}
          sx={{ opacity: isOpeningProfile ? 0.5 : 1 }}
          src="https://i-giaitri.vnecdn.net/2021/03/14/Avatar-1615695904-2089-1615696022_680x0.jpg"
        />
        {isOpeningProfile ? (
          <ArrowDropUp
            onClick={() => closeProfileBox()}
            sx={{ position: 'absolute', color: '#000', fontSize: '35px', zIndex: 2 }}
          />
        ) : null}
      </IconButton>
      <BoxProfile />
    </RootStyle>
  );
}

export default ProfileBar;
