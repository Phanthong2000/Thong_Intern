import React, { useEffect, useState } from 'react';
import { Box, styled, Grid, Avatar, Button, Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { actionPageModalCreatePost } from '../../redux/actions/pageAction';
import ModalCreatePost from './ModalCreatePost';
import { db } from '../../firebase-config';
import Post from './Post';
import Photos from './Photos';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%'
}));
const BoxContent = styled(Grid)(({ theme }) => ({
  width: '80%',
  marginLeft: '10%',
  [theme.breakpoints.down('md')]: {
    width: '90%',
    marginLeft: '5%'
  }
}));
BoxPost.prototype = {
  page: PropTypes.object
};
function BoxPost({ page }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const modalCreatePostPage = useSelector((state) => state.page.modalCreatePostPage);
  const [allPosts, setAllPosts] = useState([]);
  const getAllPosts = async () => {
    const data = await getDocs(query(collection(db, 'posts'), where('pageId', '==', page.id)));
    if (!data.empty) {
      const allPosts = [];
      data.docs.forEach((post) => {
        allPosts.push({
          ...post.data(),
          id: post.id
        });
      });
      setAllPosts(allPosts.sort((a, b) => b.createdAt - a.createdAt));
    }
  };
  useEffect(() => {
    getAllPosts();
    return () => null;
  }, []);
  const UpPost = () => {
    const ButtonUpPost = styled(Button)(({ theme }) => ({
      background: theme.palette.background,
      width: '100%',
      borderRadius: '100px',
      textTransform: 'none',
      fontSize: '18px',
      color: theme.palette.green,
      height: '50px',
      fontWeight: 'bold',
      marginLeft: '10px',
      ':hover': {
        background: 'lightgrey'
      }
    }));
    return (
      <Card sx={{ display: 'flex', background: '#fff', padding: '10px' }}>
        <Avatar sx={{ cursor: 'pointer', width: '50px', height: '50px' }} src={page.avatar} />
        <ButtonUpPost
          onClick={() =>
            dispatch(
              actionPageModalCreatePost({
                status: true,
                page
              })
            )
          }
        >
          What's on your mind?
        </ButtonUpPost>
      </Card>
    );
  };
  return (
    <RootStyle>
      <BoxContent container>
        <Grid sx={{ width: '100%', padding: '5px' }} item xs={12} sm={12} md={12} lg={5} xl={5}>
          <Photos user={user} allPosts={allPosts} />
        </Grid>
        <Grid
          sx={{ width: '100%', marginTop: '10px', padding: '5px' }}
          item
          xs={12}
          sm={12}
          md={12}
          lg={7}
          xl={7}
        >
          {page.userCreate === user.id && <UpPost />}
          {allPosts.map((item, index) => (
            <Post key={index} user={user} post={item} getAllPosts={getAllPosts} pageOk />
          ))}
        </Grid>
      </BoxContent>
      {modalCreatePostPage.status && <ModalCreatePost getAllPosts={getAllPosts} />}
    </RootStyle>
  );
}

export default BoxPost;
