import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Grid, styled, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionPostAddTag } from '../../redux/actions/postAction';

const RootStyle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1),
  display: 'flex',
  alignItems: 'center',
  height: '50px',
  cursor: 'pointer',
  ':hover': {
    background: 'lightgrey'
  }
}));
const AvatarFriend = styled(Avatar)(() => ({
  width: '30px',
  height: '30px'
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '14px',
  marginLeft: '10px'
}));
ItemSuggestion.prototype = {
  friend: PropTypes.object
};
function ItemSuggestion({ friend }) {
  const tags = useSelector((state) => state.post.tags);
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    const checkAdded = tags.find((tag) => tag.id === friend.id);
    if (checkAdded !== undefined) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [tags]);
  const addTag = () => {
    dispatch(
      actionPostAddTag({
        ...friend
      })
    );
  };
  if (added) return null;
  return (
    <RootStyle onClick={addTag}>
      <AvatarFriend src={friend.avatar} />
      <Username>{friend.username}</Username>
    </RootStyle>
  );
}

export default ItemSuggestion;
