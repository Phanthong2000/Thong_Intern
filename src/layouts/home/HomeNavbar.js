import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Stack,
  styled,
  Toolbar,
  Box,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuBar from '../../components/home/MenuBar';
import ProfileBar from '../../components/home/ProfileBar';
import SearchBar from '../../components/home/SearchBar';
import logo from '../../asset/images/logo.svg';
import Responsive from '../../responsive/Responsive';
import ListSearch from '../../components/home/ListSearch';
import sidebarConfig from './SidebarConfig';

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
const IconDrawer = styled(Icon)(({ theme }) => ({
  color: theme.palette.green,
  width: '25px',
  height: '25px'
}));
const NameDrawer = styled(ListItemText)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.green,
  marginLeft: '10px'
}));
HomeNavbar.prototype = {
  user: PropTypes.object
};
function HomeNavbar({ user }) {
  const isSearching = useSelector((state) => state.user.isSearching);
  const isMessenger = useSelector((state) => state.user.isMessenger);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const chooseLogo = () => {
    if (pathname === '/home/app') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/home/app');
    }
  };
  return (
    <RootStyle>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={3}>
          <Logo onClick={chooseLogo} src={logo} alt="Logo" />
          <Responsive width="mdUp">
            <MenuBar click={() => setOpenDrawer(true)} />
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
      <SwipeableDrawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List sx={{ background: '#fff', width: '200px', height: '100%' }}>
          {sidebarConfig.map((item, index) => {
            const chooseDrawer = () => {
              navigate(`${item.path}`);
            };
            return (
              <ListItemButton
                onClick={chooseDrawer}
                sx={
                  pathname.includes(item.path) && {
                    background: '#30ab78',
                    '&:hover': { background: '#30ab78' }
                  }
                }
                key={index}
              >
                <IconDrawer
                  style={pathname.includes(item.path) && { color: '#fff' }}
                  key={index}
                  icon={item.icon}
                />
                <NameDrawer sx={pathname.includes(item.path) && { color: '#fff' }} key={index}>
                  {item.name}
                </NameDrawer>
              </ListItemButton>
            );
          })}
        </List>
      </SwipeableDrawer>
    </RootStyle>
  );
}

export default HomeNavbar;
