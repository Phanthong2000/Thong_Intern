import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { doc, getDoc } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';
import { db } from '../../firebase-config';

const RootStyle = styled(ListItemButton)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
}));
ItemSearchText.prototype = {
  search: PropTypes.object
};
function ItemSearchText({ search }) {
  return (
    <ListItem>
      <RootStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon style={{ width: '25px', height: '25px' }} icon="ic:outline-access-time" />
          <Typography sx={{ marginLeft: '10px' }}>{search.content}</Typography>
        </Box>
        <IconButton>
          <Icon icon="ep:close-bold" />
        </IconButton>
      </RootStyle>
    </ListItem>
  );
}

export default ItemSearchText;
