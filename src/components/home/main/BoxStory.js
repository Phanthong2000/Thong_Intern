import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Skeleton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import Story from './Story';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '50%',
  height: '200px',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    justifyContent: 'space-around'
  }
}));
const BoxCreateStory = styled(Card)(({ theme }) => ({
  width: '110px',
  height: '200px',
  textAlign: 'center',
  cursor: 'pointer',
  ':hover': {
    background: 'lightgray'
  },
  [theme.breakpoints.down('sm')]: {
    width: '100px'
  }
}));
const AvatarUser = styled('img')(() => ({
  width: '100%',
  height: '140px'
}));
const IconCreate = styled(Icon)(({ theme }) => ({
  color: theme.palette.green,
  width: '40px',
  height: '40px',
  marginTop: '-30px'
}));
const SkeletonPost = styled(Skeleton)(() => ({
  width: '120px',
  height: '200px',
  marginRight: '10px',
  borderRadius: '10px'
}));
BoxStory.prototype = {
  user: PropTypes.object
};
function BoxStory({ user }) {
  const [stories, setStories] = useState([]);
  const [quantityStory, setQuantityStory] = useState(-1);
  const getStories = () => {
    getDocs(collection(db, 'stories')).then((snapshots) => {
      if (snapshots.empty) {
        setQuantityStory(0);
      } else {
        const stories = [];
        snapshots.docs.forEach((story) => {
          stories.push({
            ...story.data(),
            id: story.id
          });
        });
        const storiesSort = stories.sort((a, b) => b.createdAt - a.createdAt);
        setStories(storiesSort);
        setQuantityStory(storiesSort.length);
      }
    });
  };
  useEffect(() => {
    getStories();
  }, []);
  if (quantityStory < 0)
    return (
      <RootStyle>
        <SkeletonPost variant="rectangular" />
        <SkeletonPost variant="rectangular" />
        <SkeletonPost variant="rectangular" />
        <SkeletonPost variant="rectangular" />
      </RootStyle>
    );
  return (
    <RootStyle>
      <BoxCreateStory elevation={3}>
        <AvatarUser src={user.avatar} />
        <IconCreate sty icon="carbon:add-filled" />
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Create story</Typography>
      </BoxCreateStory>
      {stories.map((item, index) => (
        <Story user={user} story={item} key={index} />
      ))}
    </RootStyle>
  );
}

export default BoxStory;
