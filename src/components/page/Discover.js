import { Icon } from '@iconify/react';
import { Avatar, Box, Button, Card, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionGetAllPages, actionGetLikedPages } from '../../redux/actions/pageAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '10px 0px',
  background: theme.palette.background
}));
Discover.prototype = {
  user: PropTypes.object
};
function Discover({ user }) {
  const allPages = useSelector((state) => state.page.allPages);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Page = ({ page }) => {
    const AvatarGroup = styled('img')(() => ({
      width: '100%',
      height: '250px'
    }));
    const ButtonJoinGroup = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#000',
      background: theme.palette.background,
      fontWeight: 'bold',
      fontSize: '16px',
      width: '100%',
      margin: '20px 0px'
    }));
    const like = () => {
      const pageNew = {
        ...page,
        likes: [...page.likes, user.id],
        followers: [...page.followers, user.id]
      };
      updateDoc(doc(db, 'pages', page.id), pageNew).then((snapshot) => {
        dispatch(actionGetAllPages(user.id));
        dispatch(actionGetLikedPages(user.id));
      });
    };
    const goToPage = () => {
      navigate(`/home/pages/${page.id}`);
    };
    return (
      <Grid item sx={{ width: '100%', padding: '10px' }} xs={12} sm={6} md={6} lg={6} xl={6}>
        <Card onClick={goToPage} sx={{ background: '#fff', cursor: 'pointer' }}>
          <AvatarGroup src={page.background} />
          <Box sx={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
            <Avatar src={page.avatar} />
            <Box sx={{ marginLeft: '20px' }}>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '20px' }}>
                {page.name}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'gray' }}>
                {page.category}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'gray' }}>
                {page.likes.length} people like this page
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%', padding: '10px' }}>
            <ButtonJoinGroup onClick={like} startIcon={<Icon icon="fontisto:like" />}>
              Like
            </ButtonJoinGroup>
          </Box>
        </Card>
      </Grid>
    );
  };
  return (
    <RootStyle>
      <Grid sx={{ width: '70%', marginLeft: '10%' }} container>
        {allPages.map((item, index) => (
          <Page key={index} page={item} />
        ))}
      </Grid>
    </RootStyle>
  );
}

export default Discover;
