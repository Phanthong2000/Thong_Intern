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
PageSearch.prototype = {
  user: PropTypes.object,
  page: PropTypes.object
};
function PageSearch({ user, page }) {
  return (
    <RootStyle>
      <Box sx={{ display: 'flex' }}>
        <AvatarPage src={page.avatar} />
        <Box sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{page.name}</Typography>
          <Box sx={{ color: 'gray', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px' }}>Page</Typography>
            <Icon icon="ci:dot-01-xs" />
            <Typography sx={{ fontSize: '14px' }}>{page.category}</Typography>
            <Icon icon="ci:dot-01-xs" />
            <Typography sx={{ fontSize: '14px' }}>{page.likes.length} like this</Typography>
          </Box>
        </Box>
      </Box>
      <Tooltip title={page.likes.includes(user.id) ? `You liked this page` : `Like this page`}>
        <WrapperIcon
          sx={!page.likes.includes(user.id) && { background: 'lightgrey', color: '#000' }}
        >
          <IconStatus icon="fontisto:like" />
        </WrapperIcon>
      </Tooltip>
    </RootStyle>
  );
}

export default PageSearch;
