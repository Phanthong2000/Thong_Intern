import React, { useEffect, useState } from 'react';
import { Box, styled, Card, Typography, ListItemButton, IconButton } from '@mui/material';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionSearchAll,
  actionSearchAllFriendRequests,
  actionSearchAllFriends,
  actionSearchAllPeople,
  actionSearchAllSent
} from '../redux/actions/userAction';
import searchConfig from '../components/search/searchConfig';

const heightScreen = window.innerHeight;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  display: 'flex',
  background: theme.palette.background,
  padding: '20px'
}));
const BoxMenuSearch = styled(Card)(({ theme }) => ({
  width: '400px',
  background: '#fff',
  height: `calc(${heightScreen - 100}px)`,
  padding: theme.spacing(2)
}));
const BoxContentSearch = styled(Box)(() => ({
  width: '100%'
}));
function Search() {
  const user = useSelector((state) => state.user.user);
  const nameSearch = useParams().name;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.id !== undefined) dispatch(actionSearchAll(nameSearch, user.id));
    return () => null;
  }, [user, nameSearch]);
  useEffect(() => {
    document.title = `${nameSearch} - Search results | Thong Intern`;
    return () => null;
  }, [user]);
  const ButtonMenuSearch = ({ icon, link, name }) => {
    const ButtonMenu = styled(ListItemButton)(({ theme }) => ({
      width: '100%',
      textTransform: 'none',
      borderRadius: '5px'
    }));
    const IconMenu = styled(Icon)(({ theme }) => ({
      width: '20px',
      height: '20px'
    }));
    const NameMenu = styled(Typography)(() => ({
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: '15px',
      marginLeft: '10px'
    }));
    const chooseMenu = () => {
      // if (link === '/home/search/all') dispatch(actionSearchAllPeople(nameSearch, user.id));
      // if (link === '/home/search/all-people') dispatch(actionSearchAllFriends(nameSearch, user.id));
      // if (link === '/home/search/all-sent') dispatch(actionSearchAllSent(nameSearch, user.id));
      // if (link === '/home/search/all-requests')
      //   dispatch(actionSearchAllFriendRequests(nameSearch, user.id));
      navigate(`${link}/${nameSearch}`);
    };
    return (
      <ButtonMenu
        sx={{
          background: window.location.pathname.includes(link) && 'lightgrey'
        }}
        onClick={chooseMenu}
      >
        <Box
          sx={{
            background: window.location.pathname.includes(link) ? '#30ab78' : 'lightgrey',
            width: '35px',
            height: '35px',
            borderRadius: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled
        >
          <IconMenu sx={{ color: window.location.pathname.includes(link) && '#fff' }} icon={icon} />
        </Box>

        <NameMenu>{name}</NameMenu>
      </ButtonMenu>
    );
  };
  return (
    <RootStyle>
      <BoxMenuSearch>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '20px',
            fontFamily: 'sans-serif',
            marginBottom: '10px'
          }}
        >
          Search results
        </Typography>
        {searchConfig.map((item, index) => (
          <ButtonMenuSearch key={index} link={item.link} icon={item.icon} name={item.name} />
        ))}
      </BoxMenuSearch>
      <BoxContentSearch>
        <Outlet />
      </BoxContentSearch>
    </RootStyle>
  );
}

export default Search;
