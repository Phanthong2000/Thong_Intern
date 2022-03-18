import React from 'react';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import PropTypes from 'prop-types';

MenuBar.prototype = {
  click: PropTypes.func
};
function MenuBar({ click }) {
  return (
    <IconButton
      onClick={click}
      size="large"
      edge="start"
      color="inherit"
      aria-label="open drawer"
      sx={{ mr: 2, color: '#30ab78' }}
    >
      <Menu />
    </IconButton>
  );
}

export default MenuBar;
