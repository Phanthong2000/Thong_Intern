import React, { useEffect, useState } from 'react';
import { AppBar, Stack, styled, Toolbar, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MenuBar from '../../components/home/MenuBar';
import ProfileBar from '../../components/home/ProfileBar';
import SearchBar from '../../components/home/SearchBar';
import logo from '../../asset/images/logo.svg';
import Responsive from '../../responsive/Responsive';
import ListSearch from '../../components/home/ListSearch';

const RootStyle = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - 80px)`,
  background: '#fff',
  height: '60px',
  boxShadow: 3,
  justifyContent: 'center',
  position: 'fixed',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const Logo = styled('img')(({ theme }) => ({
  width: '50px',
  height: '40px',
  cursor: 'pointer'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '0',
  background: '#fff',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  width: '350px',
  top: '0px',
  color: '#000',
  zIndex: 999
}));
HomeNavbar.prototype = {
  user: PropTypes.object
};
function HomeNavbar({ user }) {
  const isSearching = useSelector((state) => state.user.isSearching);
  const isMessenger = useSelector((state) => state.user.isMessenger);
  return (
    <RootStyle>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={3}>
          <Logo onClick={() => window.scrollTo(0, 0)} src={logo} alt="Logo" />
          <Responsive width="mdUp">
            <MenuBar />
          </Responsive>
          <SearchBar />
        </Stack>
        <ProfileBar user={user} />
      </Toolbar>
      {isSearching && (
        <BoxSearch>
          <ListSearch user={user} />
        </BoxSearch>
      )}
    </RootStyle>
  );
}

export default HomeNavbar;
