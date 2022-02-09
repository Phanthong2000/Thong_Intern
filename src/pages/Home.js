import React, { useEffect, useState } from 'react';
import { Box, styled, TextField } from '@mui/material';
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
  const [comment, setComment] = useState('');
  return (
    <RootStyle style={{ background: '#fff' }}>
      <TextField
        multiline
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
    </RootStyle>
  );
}

export default Home;
