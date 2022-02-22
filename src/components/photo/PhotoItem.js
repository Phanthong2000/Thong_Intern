import React from 'react';
import { Box, Card, styled } from '@mui/material';
import PropTypes from 'prop-types';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '60%',
  background: '#fff',
  display: 'flex',
  padding: '20px',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const Photo = styled('img')(({ theme }) => ({
  width: '100%',
  height: '600px'
}));
PhotoItem.prototype = {
  user: PropTypes.object,
  url: PropTypes.string
};
function PhotoItem({ user, url }) {
  return (
    <RootStyle elevation={3}>
      <Photo src={url} />
    </RootStyle>
  );
}

export default PhotoItem;
