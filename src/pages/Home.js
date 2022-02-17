import React, { useEffect, useState } from 'react';
import { Box, styled, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { actionTestSearch } from '../redux/actions/userAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  height: '100%',
  background: theme.palette.background
}));
Home.prototype = {
  user: PropTypes.object
};
function Home({ user }) {
  const chatboxs = useSelector((state) => state.chat.chatboxs);
  const testSearch = useSelector((state) => state.user.testSearch);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (testSearch.length > 0) {
      console.log('home');
      navigate(`/home/other/${testSearch}`);
      dispatch(actionTestSearch(''));
      window.document.title = 'Thong Intern';
    } else {
      window.document.title = 'Home';
    }
  }, []);
  const [comment, setComment] = useState('');
  return (
    <RootStyle>
      <Box>Post</Box>
      <Box>Contact</Box>
    </RootStyle>
  );
}

export default Home;
