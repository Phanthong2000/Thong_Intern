import React from 'react';
import { styled, Box, List, ListItem, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavbar from './home/HomeNavbar';
import HomeSidebar from './home/HomeSidebar';
import { actionUserCloseSearch, actionUserCloseProfile } from '../redux/actions/userAction';

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  display: 'block'
}));
const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  display: 'flex',
  background: theme.palette.button,
  marginTop: '60px'
}));
// const BoxProfile = styled
function HomeLayout() {
  const isSearching = useSelector((state) => state.user.isSearching);
  const dispatch = useDispatch();
  const closeSearch = () => {
    dispatch(actionUserCloseSearch());
  };
  const closeProfileBox = () => {
    dispatch(actionUserCloseProfile());
  };
  return (
    <RootStyle>
      <HomeNavbar />
      <MainStyle
        onClick={() => {
          closeSearch();
          closeProfileBox();
        }}
      >
        <HomeSidebar />
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}

export default HomeLayout;
