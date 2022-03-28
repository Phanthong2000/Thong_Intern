import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../firebase-config';
import Post from '../components/post/Post';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  marginTop: '60px',
  minHeight: `${heightScreen - 60}px`,
  padding: '0px 20% 20%'
}));
function PostNotification() {
  const user = useSelector((state) => state.user.user);
  const { id } = useParams();
  const [post, setPost] = useState({});
  const getPost = () => {
    getDoc(doc(db, 'posts', id)).then((snapshot) => {
      setPost({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getPost();
    return () => null;
  }, [id]);
  if (post.id === undefined) return null;
  return (
    <RootStyle>
      <Post post={post} user={user} />
    </RootStyle>
  );
}

export default PostNotification;
