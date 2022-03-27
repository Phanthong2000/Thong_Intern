import React from 'react';
import { Box, Grid, styled, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Invite from './Invite';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '30px 0px'
}));
const BoxTitle = styled(Box)(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: '0px'
  }
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '25px',
  fontFamily: 'sans-serif'
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: '0px'
  }
}));
function Invites() {
  const user = useSelector((state) => state.user.user);
  const allInvites = useSelector((state) => state.page.allInvites);
  return (
    <RootStyle>
      <BoxTitle>
        <Title>Invites</Title>
        <Title sx={{ fontSize: '20px' }}>Page Invites</Title>
      </BoxTitle>
      <BoxContent>
        {allInvites.map((item, index) => (
          <Invite key={index} invite={item} />
        ))}
      </BoxContent>
    </RootStyle>
  );
}

export default Invites;
