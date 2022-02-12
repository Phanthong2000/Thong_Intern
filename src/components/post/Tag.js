import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const Username = styled(Typography)(() => ({
  marginLeft: '3px',
  fontWeight: 'bold',
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
      console.log(user.data());
    });
  };
  useEffect(() => {
    getUserPost();
    return null;
  }, [userId]);
  return <Username> {userTag.username}</Username>;
}

export default Tag;
