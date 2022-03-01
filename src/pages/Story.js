import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { styled, Box, Card, Typography } from '@mui/material';
import BoxStory from '../components/story/BoxStory';
import UserStory from '../components/story/UserStory';

const heightScreen = window.innerHeight;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  height: `${heightScreen - 61}px`,
  background: theme.palette.background,
  display: 'flex',
  padding: '20px',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    padding: '0px'
  }
}));
const BoxUserStory = styled(Card)(({ theme }) => ({
  width: '400px',
  background: '#fff',
  height: '100%',
  padding: '10px',
  maxHeight: '100%',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
Story.prototype = {
  user: PropTypes.object
};
function Story({ user }) {
  const friends = useSelector((state) => state.user.friends);
  const allStories = useSelector((state) => state.user.allStories);
  const navigate = useNavigate();
  const storiesUser = useSelector((state) => state.user.stories);
  const BoxCreateStory = () => {
    const CreateStory = styled(Box)(() => ({
      margin: '10px 0px',
      display: 'flex',
      alignItems: 'center'
    }));
    const goToCreateStory = () => {
      navigate('/home/create-story');
    };
    return (
      <CreateStory>
        <Box
          onClick={goToCreateStory}
          sx={{
            width: '60px',
            height: '60px',
            background: '#f5f7f6',
            borderRadius: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer  '
          }}
        >
          <Icon
            style={{ color: '#30ab78', width: '30px', height: '30px' }}
            icon="fluent:add-16-filled"
          />
        </Box>
        <Box sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Create a story</Typography>
          <Typography sx={{ color: 'gray', fontSize: '12px' }}>
            Share a photo or write something
          </Typography>
        </Box>
      </CreateStory>
    );
  };
  const BoxSelectStory = () => {
    const SelectStory = styled(Box)(() => ({
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }));
    return (
      <SelectStory>
        <Box>
          <Icon style={{ width: '100px', height: '100px', color: 'gray' }} icon="ion:images" />
          <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: 'gray' }}>
            Select a story to open
          </Typography>
        </Box>
      </SelectStory>
    );
  };
  return (
    <RootStyle>
      <BoxUserStory>
        <Typography sx={{ fontWeight: 'bold', fontFamily: 'inherit', fontSize: '22px' }}>
          Stories
        </Typography>
        <Typography
          sx={{ fontFamily: 'inherit', fontSize: '18px', marginTop: '20x', fontWeight: 'bold' }}
        >
          Your Story
        </Typography>
        {storiesUser.length > 0 ? <UserStory other={user.id} user={user} /> : <BoxCreateStory />}

        <Typography
          sx={{ fontFamily: 'inherit', fontSize: '18px', marginTop: '20x', fontWeight: 'bold' }}
        >
          All Stories
        </Typography>
        {friends.map((item, index) => (
          <UserStory key={index} other={item.friendId} user={user} />
        ))}
      </BoxUserStory>
      {allStories.user === '' ? <BoxSelectStory /> : <BoxStory user={user} />}
    </RootStyle>
  );
}

export default Story;
