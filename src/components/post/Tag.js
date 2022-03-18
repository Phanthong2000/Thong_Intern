import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, styled, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const Username = styled(Typography)(() => ({
  marginLeft: '3px',
  fontWeight: 'bold',
  fontSize: '15px',
  ':hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}));
Tag.prototype = {
  userId: PropTypes.string
};
function Tag({ userId }) {
  const [userTag, setUserTag] = useState({});
  const getUserPost = () => {
    getDoc(doc(db, 'users', userId)).then((user) => {
      setUserTag({
        ...user.data(),
        id: user.id
      });
    });
  };
  useEffect(() => {
    getUserPost();
    return () => null;
  }, [userId]);
  if (userTag.username === undefined) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '3px' }}>
      <Username> {userTag.username}</Username>
    </Box>
  );
}

export default Tag;
