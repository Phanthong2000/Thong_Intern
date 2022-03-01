import React from 'react';
import { Card, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const RootStyle = styled(Card)(() => ({
  width: '100%',
  background: '#fff',
  padding: '20px'
}));
ProfileSetting.prototype = {
  user: PropTypes.object
};
function ProfileSetting({ user }) {
  return (
    <RootStyle>
      <Typography>{user.username}</Typography>
    </RootStyle>
  );
}

export default ProfileSetting;
