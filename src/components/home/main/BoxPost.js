import React, { useEffect } from 'react';
import { Box, Stack, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import BoxStory from './BoxStory';
import UpPost from './UpPost';
import Post from '../../post/Post';

const RootStyle = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column'
}));
BoxPost.prototype = {
  user: PropTypes.object
};
function BoxPost({ user }) {
  const allPosts = useSelector((state) => state.post.allPosts);
  const isLoadingAllPosts = useSelector((state) => state.post.isLoadingAllPosts);
  return (
    <RootStyle>
      <BoxStory user={user} />
      <UpPost user={user} />
      {isLoadingAllPosts ? (
        <Box sx={{ width: '50%' }}>
          {allPosts.map((item, index) => (
            <Post key={index} user={user} post={item} />
          ))}
        </Box>
      ) : null}
    </RootStyle>
  );
}

export default BoxPost;
