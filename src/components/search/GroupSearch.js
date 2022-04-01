import React from 'react';
import { Avatar, Box, Card, IconButton, styled, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '70%',
  background: '#fff',
  marginBottom: '10px',
  marginLeft: '15%',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  display: 'flex',
  alignItems: 'center'
}));
const AvatarPage = styled(Avatar)(({ theme }) => ({
  width: '70px',
  height: '70px'
}));
const WrapperIcon = styled(IconButton)(({ theme }) => ({
  background: theme.palette.second,
  color: theme.palette.green
}));
const IconStatus = styled(Icon)(({ theme }) => ({
  width: '25px',
  height: '25px'
}));
GroupSearch.prototype = {
  user: PropTypes.object,
  group: PropTypes.object
};
function GroupSearch({ user, group }) {
  return (
    <RootStyle>
      <Box sx={{ display: 'flex' }}>
        <AvatarPage src={group.avatar} />
        <Box sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{group.name}</Typography>
          <Box sx={{ color: 'gray', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px' }}>Group</Typography>
            <Icon icon="ci:dot-01-xs" />
            <Typography sx={{ fontSize: '14px' }}>{group.status}</Typography>
            <Icon icon="ci:dot-01-xs" />
            <Typography sx={{ fontSize: '14px' }}>{group.members.length} members</Typography>
          </Box>
        </Box>
      </Box>
      <Tooltip title={group.members.includes(user.id) ? `Visit group` : `Join group ${group.name}`}>
        <WrapperIcon
          sx={!group.members.includes(user.id) && { background: 'lightgrey', color: '#000' }}
        >
          {group.members.includes(user.id) ? (
            <IconStatus icon="fluent:people-checkmark-16-filled" />
          ) : (
            <IconStatus icon="fluent:people-add-16-filled" />
          )}
        </WrapperIcon>
      </Tooltip>
    </RootStyle>
  );
}

export default GroupSearch;
