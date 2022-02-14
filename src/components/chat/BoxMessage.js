import React from 'react';
import PropTypes from 'prop-types';
import { Stack, styled } from '@mui/material';
import {} from '@iconify/react';

const RootStyle = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxHeight: '100%',
  background: '#fff',
  marginLeft: '50px',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0
  }
}));
BoxMessage.prototype = {
  user: PropTypes.object
};
function BoxMessage({ user }) {
  return <RootStyle>{user.username}</RootStyle>;
}

export default BoxMessage;
