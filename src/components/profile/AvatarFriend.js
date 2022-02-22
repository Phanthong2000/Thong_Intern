import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Grid, Skeleton, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const ImageAvatar = styled(Avatar)(() => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}));
AvatarFriend.prototype = {
  friend: PropTypes.object,
  index: PropTypes.number
};
function AvatarFriend({ friend, index }) {
  const [userFriend, setUserFriend] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    getDoc(doc(db, 'users', friend.friendId)).then((snapshot) => {
      setUserFriend({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
    return () => null;
  }, [friend]);
  const goToOther = () => {
    navigate(`/home/other/${friend.friendId}`);
  };
  return (
    <Box sx={{ marginLeft: '-10px', zIndex: 10 - index }}>
      {userFriend.avatar === undefined ? (
        <Skeleton variant="circular" sx={{ width: '30px', height: '30px' }} />
      ) : (
        <ImageAvatar onClick={goToOther} src={userFriend.avatar} />
      )}
    </Box>
  );
}

export default AvatarFriend;
