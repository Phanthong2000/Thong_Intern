import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Skeleton, styled } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const AvatarUser = styled(Avatar)(() => ({
  width: '25px',
  height: '25px',
  border: '1px solid #fff'
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '25px',
  height: '25px'
}));
AvatarMutualFriend.prototype = {
  mutualFriendId: PropTypes.object,
  margin: PropTypes.number,
  zIndex: PropTypes.number
};
function AvatarMutualFriend({ mutualFriendId, margin, zIndex }) {
  const [userMutualFriend, setUserMutualFriend] = useState({});
  useEffect(() => {
    if (mutualFriendId !== undefined)
      getDoc(doc(db, 'users', mutualFriendId)).then((snapshot) => {
        setUserMutualFriend({
          ...snapshot.data(),
          id: snapshot.id
        });
      });
    return () => null;
  }, []);
  if (userMutualFriend.avatar === undefined)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SkeletonAvatar variant="circular" />
      </Box>
    );
  return <AvatarUser sx={{ marginLeft: margin, zIndex }} src={userMutualFriend.avatar} />;
}

export default AvatarMutualFriend;
