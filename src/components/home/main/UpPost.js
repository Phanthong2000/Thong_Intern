import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, styled, Skeleton } from '@mui/material';
import { GiphyFetch } from '@giphy/js-fetch-api';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '50%',
  marginTop: '20px',
  padding: theme.spacing(1, 2, 1),
  background: '#fff',
  [theme.breakpoints.down('md')]: {
    width: '90%'
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
const giphy = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);
function UpPost({ user }) {
  const handleClick = async () => {
    const res = await giphy.emoji('hello', { limit: 20, offset: 0 });
    console.log(res.data);
  };
  return (
    <RootStyle elevation={3}>
      <BoxUpPost>
        {user.avatar !== undefined ? (
          <>
            <Avatar sx={{ cursor: 'pointer', width: '50px', height: '50px' }} src={user.avatar} />
            <ButtonUpPost onClick={handleClick}>What's on your mind</ButtonUpPost>
          </>
        ) : (
          <>
            <SkeletonAvatar variant="circular" />
            <SkeletonButtonPost variant="rectangular" />
          </>
        )}
      </BoxUpPost>
    </RootStyle>
  );
}

export default UpPost;
