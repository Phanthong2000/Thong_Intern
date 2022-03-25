import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/material';
import Post from '../post/Post';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '20px 0px'
}));
YourFeed.prototype = {
  user: PropTypes.object
};
function YourFeed({ user }) {
  const postsAllGroup = useSelector((state) => state.group.postsAllGroup);
  return (
    <RootStyle>
      <Box sx={{ width: '70%', marginLeft: '10%' }}>
        {postsAllGroup.map((item, index) => (
          <Post key={index} user={user} post={item} />
        ))}
      </Box>
    </RootStyle>
  );
}

export default YourFeed;
