import React from 'react';
import PropTypes from 'prop-types';
import { Box, ListItemButton, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
OptionPage.prototype = {
  option: PropTypes.object
};
function OptionPage({ option }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const allInvites = useSelector((state) => state.page.allInvites);
  return (
    <RootStyle
      onClick={() => navigate(`${option.path}`)}
      sx={{ background: pathname === option.path && 'lightgrey' }}
    >
      <IconOption style={pathname === option.path && { color: '#30ab78' }} icon={option.icon} />
      {option.name !== 'Invites' ? (
        <Title>{option.name}</Title>
      ) : (
        <Box sx={{ marginLeft: '10px' }}>
          <Title sx={{ marginLeft: '0px' }}>{option.name}</Title>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon style={{ color: 'green' }} icon="ci:dot-04-l" />
            <Typography sx={{ color: 'gray' }}>{allInvites.length} new</Typography>
          </Box>
        </Box>
      )}
    </RootStyle>
  );
}

export default OptionPage;
