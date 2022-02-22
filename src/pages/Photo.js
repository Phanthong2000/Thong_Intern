import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import PhotoItem from '../components/photo/PhotoItem';
import { db } from '../firebase-config';
import CommentPhoto from '../components/photo/CommentPhoto';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  height: '100%',
  background: theme.palette.background,
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
Photo.prototype = {
  user: PropTypes.object
};
function Photo({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const getPostById = () => {
    getDoc(doc(db, 'posts', id)).then((snapshot) => {
      setPost({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    if (user.id !== undefined) getPostById();
    return () => null;
  }, [user]);
  return (
    <RootStyle>
      <PhotoItem user={user} url={post.contentFile} />
      {post.id !== undefined && <CommentPhoto user={user} postCurrent={post} />}
    </RootStyle>
  );
}

export default Photo;
