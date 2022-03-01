import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Stack, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionUserGetAllStoryUser } from '../../redux/actions/userAction';

const RootStyle = styled(Button)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
  padding: '10px',
  textTransform: 'none',
  color: theme.palette.green
}));
const AvatarUser = styled(Avatar)(({ theme }) => ({
  width: '50px',
  height: '50px',
  outline: `3px solid ${theme.palette.green}`
}));
UserStory.prototype = {
  user: PropTypes.object,
  other: PropTypes.object
};
function UserStory({ user, other }) {
  const [userShare, setUserShare] = useState({});
  const [quantityStory, setQuantityStory] = useState(0);
  const [storyLast, setStoryLast] = useState({});
  const [stories, setStories] = useState([]);
  const dispatch = useDispatch();
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
  const chooseUserStory = () => {
    const storiesSort = stories.sort((a, b) => a.createdAt - b.createdAt);
    console.log({
      user: userShare,
      stories: storiesSort
    });
    dispatch(
      actionUserGetAllStoryUser({
        user: userShare,
        stories: storiesSort
      })
    );
  };
  if (quantityStory <= 0) return null;
  return (
    <RootStyle onClick={chooseUserStory}>
      <AvatarUser src={userShare.avatar} />
      <Box
        sx={{
          marginLeft: '10px',
          alignItems: 'center'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
          <Typography sx={{ fontWeight: 'bold', color: '#000' }}>{userShare.username}</Typography>
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center', display: 'flex' }}>
          <Typography sx={{ fontSize: '15px' }}>{quantityStory} new</Typography>
          <Icon icon="ci:dot-01-xs" />
          <Typography sx={{ fontSize: '15px', color: 'gray' }}>
            {new Date().getTime() - storyLast.createdAt >= 259200000
              ? `${moment(storyLast.createdAt)
                  .fromNow(true)
                  .substring(0, moment(storyLast.createdAt).fromNow(true).indexOf(' '))}${moment(
                  storyLast.createdAt
                )
                  .fromNow(true)
                  .substring(
                    moment(storyLast.createdAt).fromNow(true).indexOf(' ') + 1,
                    moment(storyLast.createdAt).fromNow(true).indexOf(' ') + 2
                  )}`
              : `${moment(storyLast.createdAt).fromNow(true)}`}
          </Typography>
        </Stack>
      </Box>
    </RootStyle>
  );
}

export default UserStory;
