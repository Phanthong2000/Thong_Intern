import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Grid, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1)
}));
const AvatarFriend = styled(Avatar)(() => ({
  width: '30px',
  height: '30px'
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '14px'
}));
Suggestion.prototype = {
  friend: PropTypes.object
};
function Suggestion({ friend }) {
  const [userFriend, setUserFriend] = useState({});
  useEffect(() => {
    getDoc(doc(db, 'users', friend.friendId)).then((snapshot) => {
      setUserFriend({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  }, [friend]);
  return (
    <RootStyle>
      <AvatarFriend src={userFriend.avatar} />
      <Username>{userFriend.username}</Username>
    </RootStyle>
  );
}

export default Suggestion;
