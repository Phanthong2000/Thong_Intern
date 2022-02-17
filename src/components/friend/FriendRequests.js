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

const RootStyle = styled(Grid)(({ theme }) => ({
  width: '100%',
  padding: '5px'
}));
const Title = styled(Typography)(() => ({
  fontFamily: 'inherit',
  fontWeight: 'bold',
  fontSize: '25px'
}));
FriendRequests.prototype = {
  user: PropTypes.object
};
function FriendRequests({ user }) {
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const dispatch = useDispatch();
  const pathname = useLocation();
  return (
    <Box sx={{ padding: '20px' }}>
      <Title>Friend requests</Title>
      <RootStyle container>
        {friendRequests.map((item, index) => (
          <Request index={index} user={user} contact={item} key={index} />
        ))}
      </RootStyle>
    </Box>
  );
}

export default FriendRequests;
