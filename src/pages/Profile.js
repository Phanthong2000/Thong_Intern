import React, { useEffect, useState } from 'react';
import { Box, Grid, IconButton, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import SharePost from '../components/post/SharePost';
import { db } from '../firebase-config';
import InfoMain from '../components/profile/BackgroundImage';
import Information from '../components/profile/Information';
import Intro from '../components/profile/Intro';
import UpPost from '../components/profile/UpPost';
import UserNotFound from '../components/profile/UserNotFound';
import Post from '../components/post/Post';
import { getAllPosts } from '../redux/actions/postAction';
import Snack from '../components/Snack';
import Friends from '../components/profile/Friends';
import EmptyPost from '../components/profile/EmptyPost';
import { actionChatGetChatbox } from '../redux/actions/chatAction';
import Photos from '../components/profile/Photos';

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
  const navigate = useNavigate();
  const allPosts = useSelector((state) => state.post.posts);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantityPost, setQuantityPost] = useState(-1);
  const isLoadingUpdateProfile = useSelector((state) => state.user.isLoadingUpdateProfile);
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      if (snapshot.data() === undefined) navigate('/home/user-not-found');
      else {
        if (user.id !== undefined) {
          if (user.id !== id) navigate(`/home/other/${id}`);
        }
        document.title = `${snapshot.data().username} | Thong Intern`;
      }
    });
    dispatch(getAllPosts(id, 'desc'));
    dispatch(
      actionChatGetChatbox({
        id: '',
        user: {}
      })
    );
    setQuantityPost(allPosts.length);
    return () => null;
  }, [user]);
  const BoxPost = () => {
    if (quantityPost.length === 0) return <EmptyPost />;
    return (
      <>
        {allPosts.map((item, index) => (
          <>
            {item.type === 'share' ? (
              <SharePost key={index} post={item} user={user} />
            ) : (
              <Post post={item} key={index} user={user} />
            )}
          </>
        ))}
      </>
    );
  };
  return (
    <RootStyle sx={{ alignItems: 'center' }}>
      {isLoadingUpdateProfile ? (
        <IconButton
          sx={{
            position: 'absolute',
            marginTop: '100px',
            background: '#fff',
            '&:hover': { background: '#fff' }
          }}
        >
          <Icon
            icon="eos-icons:loading"
            style={{
              width: '50px',
              height: '50px',
              color: '#30ab78'
            }}
          />
        </IconButton>
      ) : null}
      <InfoMain user={user} />
      <Information user={user} />
      <BoxContent>
        <Grid container>
          <Grid item xs={12} sm={12} lg={5} md={5}>
            <Intro user={user} />
            <Friends user={user} />
            <Photos user={user} />
          </Grid>
          <Grid item lg={0.2} md={0.2}>
            {' '}
          </Grid>
          <Grid item xs={12} sm={12} lg={6.8} md={6.8}>
            <UpPost user={user} />
            {quantityPost < 0 ? (
              <Icon
                style={{
                  width: '50px',
                  height: '50px',
                  marginTop: '50px',
                  color: 'gray',
                  marginLeft: '50%'
                }}
                icon="eos-icons:loading"
              />
            ) : (
              <BoxPost />
            )}
          </Grid>
        </Grid>
      </BoxContent>
      <Snack />
    </RootStyle>
  );
}

export default Profile;
