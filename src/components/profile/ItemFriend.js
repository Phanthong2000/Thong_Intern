import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1)
}));
const AvatarFriend = styled('img')(() => ({
  width: '100px',
  height: '100px',
  cursor: 'pointer',
  borderRadius: '10px'
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline'
  }
}));
ItemFriend.prototype = {
  friend: PropTypes.object,
  index: PropTypes.number
};
function ItemFriend({ friend, index }) {
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
  if (index > 9) return null;
  return (
    <RootStyle item xs={4} sm={4} md={4} lg={4} xl={4}>
      <AvatarFriend onClick={goToOther} src={userFriend.avatar} />
      <Username onClick={goToOther}>{userFriend.username}</Username>
    </RootStyle>
  );
}

export default ItemFriend;
