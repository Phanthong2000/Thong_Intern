import React from 'react';
import { Box, Card, Grid, Paper, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '10px 0px',
  background: theme.palette.background
}));
Discover.prototype = {
  user: PropTypes.object
};
function Discover({ user }) {
  const allGroups = useSelector((state) => state.group.allGroups);
  const Group = ({ group }) => {
    const AvatarGroup = styled('img')(() => ({
      width: '100%',
      height: '250px'
    }));
    const checkMembers = () => {
      if (group.members.length === 1) return `1 member`;
      return `${group.members.length} members`;
    };
    return (
      <Grid item sx={{ width: '100%', padding: '10px' }} xs={12} sm={6} md={6} lg={6} xl={6}>
        <Card sx={{ background: '#fff', cursor: 'pointer' }}>
          <AvatarGroup src={group.avatar} />
          <Box sx={{ padding: '10px' }}>
            <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>
              {group.name}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'gray' }}>
              {checkMembers()}
            </Typography>
          </Box>
        </Card>
      </Grid>
    );
  };

  return (
    <RootStyle>
      <Grid sx={{ width: '70%', marginLeft: '10%' }} container>
        {allGroups.map((item, index) => (
          <Group key={index} group={item} />
        ))}
      </Grid>
    </RootStyle>
  );
}

export default Discover;
