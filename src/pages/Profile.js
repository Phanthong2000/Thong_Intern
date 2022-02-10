import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import InfoMain from '../components/profile/BackgroundImage';
import Information from '../components/profile/Information';
import Intro from '../components/profile/Intro';
import UpPost from '../components/profile/UpPost';
import UserNotFound from '../components/profile/UserNotFound';
import Post from '../components/post/Post';
import { getAllPosts } from '../redux/actions/postAction';

const RootStyle = styled(Stack)(({ theme }) => ({
  marginTop: '60px',
  background: theme.palette.background,
  height: '100%'
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '800px',
  [theme.breakpoints.down('md')]: {
    width: '95%'
  }
}));
Profile.prototype = {
  user: PropTypes.object
};
function Profile({ user }) {
  const allPosts = useSelector((state) => state.post.posts);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = `${user.username} | Thong Intern`;
    dispatch(getAllPosts(id));
  }, [user]);
  return (
    <RootStyle sx={{ alignItems: 'center' }}>
      <InfoMain user={user} />
      <Information user={user} />
      <BoxContent>
        <Grid container>
          <Grid item xs={12} sm={12} lg={5} md={5}>
            <Intro user={user} />
          </Grid>
          <Grid item lg={0.2} md={0.2}>
            {' '}
          </Grid>
          <Grid item xs={12} sm={12} lg={6.8} md={6.8}>
            <UpPost user={user} />
            {allPosts.length === 0 ? (
              <div>cc</div>
            ) : (
              allPosts.map((item, index) => (
                <div key={index}>
                  <Post user={user} post={item} />
                </div>
              ))
            )}
          </Grid>
        </Grid>
      </BoxContent>
    </RootStyle>
  );
}

export default Profile;