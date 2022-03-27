import React from 'react';
import { Avatar, ListItemButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center'
}));
PageItem.prototype = {
  page: PropTypes.object
};
function PageItem({ page }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const goToYourPage = () => {
    navigate(`/home/pages/your-page/${page.id}`);
  };
  return (
    <RootStyle
      sx={{ background: pathname === `/home/pages/your-page/${page.id}` && 'lightgrey' }}
      onClick={goToYourPage}
    >
      <Avatar sx={{ width: '40px', height: '40px' }} src={page.avatar} />
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#000',
          fontFamily: 'sans-serif',
          marginLeft: '10px'
        }}
      >
        {page.name}
      </Typography>
    </RootStyle>
  );
}

export default PageItem;
