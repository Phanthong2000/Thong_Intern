import React from 'react';
import { Backdrop, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';

function Backdrops() {
  const backdrop = useSelector((state) => state.user.backdrop);
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={backdrop.status}>
      <Box sx={{ textAlign: 'center' }}>
        <Icon icon="eos-icons:loading" style={{ width: '50px', height: '50px' }} />
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', fontFamily: 'sans-serif' }}>
          {backdrop.content}
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default Backdrops;
