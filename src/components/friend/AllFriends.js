import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, styled, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionGetAllFriendRequest,
  actionUserGetAllFriendRequest
} from '../../redux/actions/userAction';
import { db } from '../../firebase-config';
import Request from './Request';
import Friend from './Friend';

const RootStyle = styled(Grid)(({ theme }) => ({
  width: '100%',
  padding: '5px'
}));
const Title = styled(Typography)(() => ({
  fontFamily: 'inherit',
  fontWeight: 'bold',
  fontSize: '25px'
}));
AllFriends.prototype = {
  user: PropTypes.object
};
function AllFriends({ user }) {
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const friends = useSelector((state) => state.user.friends);
  const dispatch = useDispatch();
  return (
    <Box sx={{ padding: '20px' }}>
      <Title>All friends</Title>
      <RootStyle container>
        {friends.map((item, index) => (
          <Friend index={index} user={user} friend={item} key={index} />
        ))}
      </RootStyle>
    </Box>
  );
}

export default AllFriends;
