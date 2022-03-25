import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, styled, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionPostOpenCreatePost } from '../../../redux/actions/postAction';
import TagPeople from '../../post/TagPeople';
import CreatePost from '../../post/CreatePost';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '70%',
  marginTop: '20px',
  padding: theme.spacing(1, 2, 1),
  background: '#fff',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const BoxUpPost = styled(Box)(() => ({
  display: 'flex'
}));
const ButtonUpPost = styled(Button)(({ theme }) => ({
  background: theme.palette.background,
  marginLeft: '10px',
  width: '100%',
  borderRadius: '100px',
  textTransform: 'none',
  fontSize: '18px',
  color: theme.palette.green,
  height: '50px',
  fontWeight: 'bold',
  ':hover': {
    background: 'lightgrey'
  }
}));
const SkeletonAvatar = styled(Skeleton)(() => ({
  width: '50px',
  height: '50px'
}));
const SkeletonButtonPost = styled(Skeleton)(() => ({
  width: '100%',
  height: '50px',
  marginLeft: '10px',
  borderRadius: '100px'
}));
UpPost.prototype = {
  user: PropTypes.object
};
function UpPost({ user }) {
  const dispatch = useDispatch();
  const isOpenCreatePost = useSelector((state) => state.post.isOpenCreatePost);
  const isOpenTagPeople = useSelector((state) => state.post.isOpenTagPeople);
  const navigate = useNavigate();
  return (
    <RootStyle elevation={3}>
      <BoxUpPost>
        {user.avatar !== undefined ? (
          <>
            <Avatar
              onClick={() => navigate(`/home/profile/${user.id}`)}
              sx={{ cursor: 'pointer', width: '50px', height: '50px' }}
              src={user.avatar}
            />
            <ButtonUpPost onClick={() => dispatch(actionPostOpenCreatePost())}>
              What's on your mind
              <span role="img" aria-label="information">
                😀
              </span>
            </ButtonUpPost>
          </>
        ) : (
          <>
            <SkeletonAvatar variant="circular" />
            <SkeletonButtonPost variant="rectangular" />
          </>
        )}
      </BoxUpPost>
      {isOpenTagPeople ? <TagPeople user={user} /> : null}
      {isOpenCreatePost ? <CreatePost user={user} /> : null}
    </RootStyle>
  );
}

export default UpPost;
