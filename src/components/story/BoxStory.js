import React, { useEffect, useState } from 'react';
import { Avatar, Box, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import {} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';
import Stories from 'react-insta-stories';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: '#434544',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex'
}));
BoxStory.prototype = {
  user: PropTypes.object
};
function BoxStory({ user }) {
  const allStories = useSelector((state) => state.user.allStories);
  const [storyLast, setStoryLast] = useState(allStories.stories.at(allStories.length - 1));
  const renderStories = () => {
    const stories = allStories.stories.map((item, index) => ({
      content: ({ action, isPaused }) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '20px',
            // padding: '20px',
            backgroundImage: `url(${item.contentFile})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}
          >
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Avatar src={allStories.user.avatar} />
              <Typography
                sx={{
                  marginLeft: '5px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif'
                }}
              >
                {allStories.user.username}
              </Typography>
              <Typography
                sx={{ marginLeft: '10px', color: '#fff', fontFamily: 'inherit', fontSize: '14px' }}
              >
                {new Date().getTime() - item.createdAt >= 259200000
                  ? `${moment(item.createdAt)
                      .fromNow(true)
                      .substring(0, moment(item.createdAt).fromNow(true).indexOf(' '))}${moment(
                      item.createdAt
                    )
                      .fromNow(true)
                      .substring(
                        moment(item.createdAt).fromNow(true).indexOf(' ') + 1,
                        moment(item.createdAt).fromNow(true).indexOf(' ') + 2
                      )}`
                  : `${moment(item.createdAt).fromNow(true)}`}
              </Typography>
            </Stack>
          </Stack>
          <Box
            sx={{
              maxheight: '500px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
              overflow: 'auto'
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '18px',
                color: item.textColor,
                maxHeight: '500px',
                overflow: 'auto'
              }}
            >
              {item.content}
            </Typography>
          </Box>
        </Box>
      )
    }));
    return stories;
  };
  return (
    <RootStyle>
      <Stories defaultInterval={1500} stories={renderStories()} />
    </RootStyle>
  );
}

export default BoxStory;
