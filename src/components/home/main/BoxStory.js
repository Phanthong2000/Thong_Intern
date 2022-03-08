import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Skeleton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import Story from './Story';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '50%',
  height: '200px',
  marginTop: '20px',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    width: '100%'
    // justifyContent: 'space-around'
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
  const navigate = useNavigate();
  const storiesUser = useSelector((state) => state.user.stories);
  const tokenMessaging = useSelector((state) => state.user.tokenMessaging);
  const friendsHaveStory = useSelector((state) => state.user.friendsHaveStory);
  const goToCreateStory = () => {
    navigate('/home/create-story');
  };
  // useEffect(() => {
  //   setQuantityStory(friendsHaveStory.length);
  //   return () => null;
  // }, [friendsHaveStory]);
  // if (friends.length <= 0)
  //   return (
  //     <RootStyle>
  //       <BoxCreateStory onClick={goToCreateStory} elevation={3}>
  //         <AvatarUser src={user.avatar} />
  //         <IconCreate sty icon="carbon:add-filled" />
  //         <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Create story</Typography>
  //       </BoxCreateStory>
  //     </RootStyle>
  //   );
  // if (friendsHaveStory.length === 0) return null;
  return (
    <RootStyle>
      <BoxCreateStory onClick={goToCreateStory} elevation={3}>
        <AvatarUser src={user.avatar} />
        <IconCreate icon="carbon:add-filled" />
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Create story</Typography>
      </BoxCreateStory>
      {storiesUser.length > 0 && <Story user={user} other={user.id} />}
      {friendsHaveStory.map((item, index) => (
        <Story user={user} other={item} index={index} key={index} />
      ))}
    </RootStyle>
  );
}

export default BoxStory;
