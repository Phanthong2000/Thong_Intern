import React from 'react';
import PropTypes from 'prop-types';
import { ListItemButton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '5px'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  marginLeft: '10px',
  fontFamily: 'sans-serif'
}));
const IconOption = styled(Icon)(({ theme }) => ({
  width: '35px',
  height: '35px'
}));
OptionFeed.prototype = {
  option: PropTypes.object
};
function OptionFeed({ option }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <RootStyle
      onClick={() => navigate(`${option.path}`)}
      sx={{ background: pathname === option.path && 'lightgrey' }}
    >
      <IconOption style={pathname === option.path && { color: '#30ab78' }} icon={option.icon} />
      <Title>{option.name}</Title>
    </RootStyle>
  );
}

export default OptionFeed;
