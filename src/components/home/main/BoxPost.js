import React, { useEffect } from 'react';
import { Box, Stack, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import BoxStory from './BoxStory';
import UpPost from './UpPost';
import Post from '../../post/Post';
import { actionGetFriendsHaveStory } from '../../../redux/actions/userAction';
import SharePost from '../../post/SharePost';

const RootStyle = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column'
}));
const WrapperPost = styled(Box)(({ theme }) => ({
  width: '70%',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
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
      {isLoadingAllPosts && (
        <WrapperPost>
          {allPosts.map((item, index) => (
            <>
              {item.type === 'share' ? (
                <SharePost key={index} post={item} user={user} />
              ) : (
                <Post post={item} key={index} user={user} />
              )}
            </>
          ))}
        </WrapperPost>
      )}
    </RootStyle>
  );
}

export default BoxPost;
