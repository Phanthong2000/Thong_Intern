import React from 'react';
import { Box, Grid, styled, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
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
function FriendRequests() {
  const user = useSelector((state) => state.user.user);
  const friendRequests = useSelector((state) => state.user.friendRequests);
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
