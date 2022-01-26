import React, { useEffect } from 'react';
import { AppBar, Stack, styled, Toolbar, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import MenuBar from '../../components/home/MenuBar';
import ProfileBar from '../../components/home/ProfileBar';
import SearchBar from '../../components/home/SearchBar';
import logo from '../../asset/images/logo.svg';
import Responsive from '../../responsive/Responsive';
import ListSearch from '../../components/home/ListSearch';

const RootStyle = styled(AppBar)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  background: '#fff',
  height: '60px',
  boxShadow: 3,
  justifyContent: 'center',
  position: 'fixed'
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
  width: '300px',
  top: '0px',
  height: '200px',
  color: '#000'
}));
function HomeNavbar() {
  const isSearching = useSelector((state) => state.user.isSearching);
  useEffect(() => {
    console.log(isSearching);
  }, []);
  return (
    <RootStyle>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={3}>
          <Logo src={logo} alt="Logo" />
          <Responsive width="mdUp">
            <MenuBar />
          </Responsive>
          {isSearching ? <></> : <SearchBar />}
        </Stack>
        <ProfileBar />
      </Toolbar>
      {isSearching ? (
        <BoxSearch>
          <ListSearch />
        </BoxSearch>
      ) : null}
    </RootStyle>
  );
}

export default HomeNavbar;
