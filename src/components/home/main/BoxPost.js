import React from 'react';
import { Stack, styled } from '@mui/material';
import PropTypes from 'prop-types';

const RootStyle = styled(Stack)(({ theme }) => ({
  background: 'red'
}));
BoxPost.prototype = {
  user: PropTypes.object
};
function BoxPost({ user }) {
  return <RootStyle>BoxPost</RootStyle>;
}

export default BoxPost;
