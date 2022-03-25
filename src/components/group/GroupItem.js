import React from 'react';
import { Box, ListItemButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center'
}));
const AvatarGroup = styled('img')(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '5px'
}));
GroupItem.prototype = {
  group: PropTypes.object
};
function GroupItem({ group }) {
  const navigate = useNavigate();
  const goToGroup = () => {
    navigate(`/home/groups/${group.id}`);
  };
  return (
    <RootStyle onClick={goToGroup}>
      <AvatarGroup src={group.avatar} />
      <Box sx={{ marginLeft: '10px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'sans-serif' }}>
          {group.name}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'gray', fontFamily: 'sans-serif' }}>
          Last active 0 hour ago
        </Typography>
      </Box>
    </RootStyle>
  );
}

export default GroupItem;
