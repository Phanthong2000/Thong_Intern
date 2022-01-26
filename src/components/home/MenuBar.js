import React from 'react';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';

function MenuBar() {
  return (
    <IconButton
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
