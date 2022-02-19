import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Avatar, Box, Button, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const RootStyle = styled(Stack)(({ theme }) => ({
  width: '120px',
  height: '200px',
  textAlign: 'center',
  flexDirection: 'column',
  cursor: 'pointer',
  borderRadius: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '110px'
  }
}));
Story.prototype = {
  story: PropTypes.object,
  user: PropTypes.object,
  seeAll: PropTypes.number
};
function Story({ story, user, seeAll }) {
  const [userStory, setUserStory] = useState({});
  useEffect(() => {
    getDoc(doc(db, 'users', story.userId)).then((snapshot) => {
      setUserStory({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
    return () => null;
  }, []);
  return (
    <RootStyle
      boxShadow={3}
      sx={{
        backgroundImage:
          story.type === 'image' ? `url(${story.content})` : `url(${story.background})`,
        backgroundSize: `120px 200px`
      }}
    >
      <Avatar
        sx={{
          border: `4px solid ${story.watches.includes(user.id) ? `#30ab78` : `#fff`}`,
          marginLeft: '5px',
          marginTop: '5px'
        }}
        src={userStory.avatar}
      />
      {seeAll === 100 ? (
        <Box
          sx={{
            marginTop: '40px',
            marginLeft: '102px',
            width: '40px',
            height: '40px',
            borderRadius: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { background: 'lightgrey' }
          }}
        >
          <Icon
            style={{ width: '30px', height: '30px', color: 'gray' }}
            icon="bi:arrow-right-circle"
          />
        </Box>
      ) : (
        <Box sx={{ marginTop: '85px', marginRight: '-120px' }}> </Box>
      )}

      <Typography
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          fontFamily: 'inherit',
          fontSize: '14px',
          marginTop: '30px'
        }}
      >
        {userStory.username}
      </Typography>
    </RootStyle>
  );
}

export default Story;
