import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const RootStyle = styled(Stack)(({ theme }) => ({
  width: '120px',
  height: '200px',
  maxWidth: '100px',
  textAlign: 'center',
  flexDirection: 'column',
  justifyContent: 'space-between',
  cursor: 'pointer',
  borderRadius: '10px',
  marginLeft: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '110px'
  }
}));
Story.prototype = {
  user: PropTypes.object,
  other: PropTypes.object,
  index: PropTypes.number
};
function Story({ user, other, index }) {
  const storiesUser = useSelector((state) => state.user.stories);
  const [userShare, setUserShare] = useState({});
  const [quantityStory, setQuantityStory] = useState(0);
  const [storyLast, setStoryLast] = useState({});
  const [stories, setStories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUserShare = () => {
    getDoc(doc(db, 'users', other)).then((snapshot) => {
      setUserShare({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  const getStoriesByUser = async () => {
    const data = await getDocs(query(collection(db, 'stories'), where('userId', '==', other)));
    if (data.empty) {
      setQuantityStory(0);
    } else {
      const stories = [];
      data.docs.forEach((story) => {
        if (new Date().getTime() - story.data().createdAt < 86400000)
          stories.push({
            ...story.data(),
            id: story.id
          });
      });
      setQuantityStory(stories.length);
      const storiesSort = stories.sort((a, b) => b.createdAt - a.createdAt);
      setStories(storiesSort);
      setStoryLast(storiesSort.at(0));
    }
  };
  useEffect(() => {
    if (other !== undefined) {
      getUserShare();
      getStoriesByUser();
    }
    return () => null;
  }, [user]);
  const goToStories = () => {
    navigate('/home/stories');
  };
  if (storyLast === undefined || quantityStory === 0) return null;
  if (storiesUser.length > 0 && index >= 3) return null;
  if (storiesUser.length === 0 && index >= 4) return null;
  return (
    <RootStyle
      onClick={goToStories}
      boxShadow={3}
      sx={{
        backgroundImage: `url(${storyLast.contentFile})`,
        backgroundSize: `120px 200px`
      }}
    >
      <Avatar
        sx={{
          // border: `4px solid ${storyLast.watches.includes(user.id) ? `#30ab78` : `#fff`}`,
          marginLeft: '5px',
          marginTop: '5px'
        }}
        src={userShare.avatar}
      />
      <Typography
        sx={{ maxWidth: '100px', fontSize: '8px', fontWeight: 'bold', color: storyLast.textColor }}
      >
        {storyLast.content}
      </Typography>
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          fontFamily: 'inherit',
          fontSize: '14px'
        }}
      >
        {userShare.username}
      </Typography>
    </RootStyle>
  );
}

export default Story;
