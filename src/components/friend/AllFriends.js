import React from 'react';
import { Box, Grid, styled, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
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

function AllFriends() {
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.user.friends);
  return (
    <Box sx={{ padding: '20px' }}>
      <Title>All friends</Title>
      <RootStyle container>
        {friends.map((item, index) => (
          <Friend index={index} friend={item} key={index} />
        ))}
      </RootStyle>
    </Box>
  );
}

export default AllFriends;
