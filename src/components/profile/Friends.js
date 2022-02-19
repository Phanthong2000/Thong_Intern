import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, Grid, Stack, styled, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { actionGetAllFriendUser } from '../../redux/actions/userAction';
import { db } from '../../firebase-config';
import ItemFriend from './ItemFriend';

const RootStyle = styled(Card)(({ theme }) => ({
  marginTop: '10px',
  padding: theme.spacing(1, 1, 2),
  background: '#fff'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '20px'
}));
const ButtonSeeAllFriends = styled(Button)(({ theme }) => ({
  color: theme.palette.green,
  textTransform: 'none',
  fontSize: '18px'
}));
const QuantityFriend = styled(Typography)(() => ({
  color: 'gray',
  fontSize: '18px'
}));
Friends.prototype = {
  user: PropTypes.object
};
function Friends({ user }) {
  const friends = useSelector((state) => state.user.friends);
  const dispatch = useDispatch();
  const getQuantityFriend = () => {
    if (friends.length === 1) return `1 friend`;
    return `${friends.length} friends`;
  };
  return (
    <RootStyle>
      <Stack
        direction="row"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Title>Friends</Title>
        <ButtonSeeAllFriends>See all friends</ButtonSeeAllFriends>
      </Stack>
      {friends.length > 0 ? (
        <Box>
          <QuantityFriend>{getQuantityFriend()}</QuantityFriend>
          <Grid sx={{ textAlign: 'center' }} container>
            {friends.map((item, index) => (
              <ItemFriend key={index} friend={item} />
            ))}
          </Grid>
        </Box>
      ) : null}
    </RootStyle>
  );
}

export default Friends;
