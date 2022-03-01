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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actionUserCloseSearch } from '../../redux/actions/userAction';

const RootStyle = styled(ListItemButton)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
}));
ItemSearchText.prototype = {
  search: PropTypes.object
};
function ItemSearchText({ search }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chooseSearch = () => {
    dispatch(actionUserCloseSearch());
    navigate(`/home/search/all-people/${search.content}`);
  };
  return (
    <ListItem>
      <RootStyle onClick={chooseSearch}>
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
