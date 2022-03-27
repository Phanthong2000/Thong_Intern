import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Button, Card, Grid, IconButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Navigate, useNavigate } from 'react-router-dom';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '20px'
}));
const BoxContent = styled(Card)(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  background: '#fff',
  padding: '10px',
  [theme.breakpoints.down('md')]: {
    width: '90%',
    marginLeft: '5%'
  }
}));
LikedPages.prototype = {
  user: PropTypes.object
};
function LikedPages({ user }) {
  const likedPages = useSelector((state) => state.page.likedPages);
  const [quantityLikedPages, setQuantityLikedPages] = useState(-1);
  useEffect(() => {
    setQuantityLikedPages(likedPages.length);
    return () => null;
  }, []);
  const navigate = useNavigate();
  const Page = ({ page }) => {
    const AvatarPage = styled(Avatar)(({ theme }) => ({
      width: '100px',
      height: '100px'
    }));
    const ButtonStatus = styled(Button)(({ theme }) => ({
      width: '100%',
      textTransform: 'none',
      color: '#fff',
      background: theme.palette.green,
      fontWeight: 'bold',
      marginTop: '10px',
      ':hover': {
        background: theme.palette.green
      }
    }));
    const goToPage = () => {
      navigate(`/home/pages/${page.id}`);
    };
    return (
      <Grid sx={{ padding: '5px' }} item sm={12} xs={12} md={12} lg={6} xl={6}>
        <Card sx={{ padding: '10px', cursor: 'pointer' }} onClick={goToPage}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <AvatarPage src={page.avatar} />
              <Box sx={{ marginLeft: '10px' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', fontFamily: 'sans-serif' }}>
                  {page.name}
                </Typography>
                <Typography sx={{ color: 'gray', fontSize: '16px' }}>{page.category}</Typography>
              </Box>
            </Box>
            <IconButton sx={{ color: '#000', background: 'lightgrey' }}>
              <Icon icon="bi:three-dots" />
            </IconButton>
          </Box>
          {page.likes.includes(user.id) ? (
            <ButtonStatus>Liked</ButtonStatus>
          ) : (
            <ButtonStatus>Following</ButtonStatus>
          )}
        </Card>
      </Grid>
    );
  };
  if (quantityLikedPages === -1) return null;
  return (
    <RootStyle>
      <BoxContent>
        <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'sans-serif' }}>
          All Pages You Like or Follow ({likedPages.length})
        </Typography>
        <Grid sx={{ width: '100%', marginTop: '20px' }} container>
          {likedPages.map((item, index) => (
            <Page key={index} page={item} />
          ))}
        </Grid>
      </BoxContent>
    </RootStyle>
  );
}

export default LikedPages;
