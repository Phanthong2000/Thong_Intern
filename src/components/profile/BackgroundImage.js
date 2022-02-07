import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, IconButton, ListItem, Stack, styled } from '@mui/material';
import { Icon } from '@iconify/react';
import Information from './Information';

const RootStyle = styled(Card)(({ theme }) => ({
  background: '#fff',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  height: '400px'
}));
const CoverImage = styled('img')(({ theme }) => ({
  width: '900px',
  height: '400px',
  borderRadius: theme.spacing(0, 0, 2, 2),
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const CoverButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  background: '#fff',
  zIndex: 2
}));
InfoMain.prototype = {
  user: PropTypes.object
};
function InfoMain({ user }) {
  const [showEditCover, setShowEditCover] = useState('none');
  return (
    <RootStyle>
      <CoverImage
        onMouseLeave={() => setShowEditCover('none')}
        onMouseEnter={() => setShowEditCover('flex')}
        on
        src={user.background}
      />
      <CoverButton sx={{ display: showEditCover }}>
        <Icon icon="ic:baseline-photo-camera" style={{ color: '#000' }} />
      </CoverButton>
    </RootStyle>
  );
}

export default InfoMain;
