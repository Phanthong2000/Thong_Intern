import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  background: '#fff',
  padding: '10px 5px',
  marginTop: '20px'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '20px'
}));
const ImagePost = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '5px',
  height: '100%'
}));
Photos.prototype = {
  user: PropTypes.object,
  allPosts: PropTypes.array
};
function Photos({ user, allPosts }) {
  const [photos, setPhotos] = useState([]);
  const getPhotos = () => {
    const data = [];
    allPosts.forEach((post) => {
      if (post.type === 'image') data.push(post);
    });
    setPhotos(data.slice(0, 9));
  };
  useEffect(() => {
    getPhotos();
    return () => null;
  }, [user, allPosts]);
  const Photo = ({ url }) => (
    <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ padding: '5px' }}>
      <Card sx={{ padding: '5px' }}>
        <ImagePost src={url} />
      </Card>
    </Grid>
  );
  return (
    <RootStyle>
      <Title>Photos</Title>
      <Grid sx={{ width: '100%' }} container>
        {photos.map((item, index) => (
          <Photo key={index} url={item.contentFile} />
        ))}
      </Grid>
    </RootStyle>
  );
}

export default Photos;
