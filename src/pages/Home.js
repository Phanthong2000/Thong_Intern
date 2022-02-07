import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: `calc(100% - 80px)`,
  marginTop: '60px',
  height: '1000px'
}));
Home.prototype = {
  user: PropTypes.object
};
function Home({ user }) {
  useEffect(() => {
    window.document.title = 'Home';
  }, []);
  return <RootStyle style={{ background: '#fff' }}>{user}</RootStyle>;
}

export default Home;
