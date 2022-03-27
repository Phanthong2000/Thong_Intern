import React, { useEffect } from 'react';
import { Box, styled, Card, Typography, ListItemButton } from '@mui/material';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionSearchAllFriendRequests,
  actionSearchAllFriends,
  actionSearchAllPeople,
  actionSearchAllSent
} from '../redux/actions/userAction';

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
    document.title = `${nameSearch} - Search results | Thong Intern`;
    return () => null;
  }, [user]);
  const ButtonMenuSearch = ({ icon, link, name }) => {
    const ButtonMenu = styled(ListItemButton)(({ theme }) => ({
      width: '100%',
      height: '60px',
      textTransform: 'none',
      color: theme.palette.green
    }));
    const IconMenu = styled(Icon)(({ theme }) => ({
      width: '40px',
      height: '40px'
    }));
    const NameMenu = styled(Typography)(() => ({
      fontWeight: 'bold',
      fontFamily: 'inherit',
      fontSize: '20px',
      marginLeft: '10px'
    }));
    const chooseMenu = () => {
      if (link === '/home/search/all-people') dispatch(actionSearchAllPeople(nameSearch, user.id));
      if (link === '/home/search/all-friends')
        dispatch(actionSearchAllFriends(nameSearch, user.id));
      if (link === '/home/search/all-sent') dispatch(actionSearchAllSent(nameSearch, user.id));
      if (link === '/home/search/all-requests')
        dispatch(actionSearchAllFriendRequests(nameSearch, user.id));
      navigate(`${link}/${nameSearch}`);
    };
    return (
      <ButtonMenu
        sx={{
          background: window.location.pathname.includes(link) && '#30ab78',
          color: window.location.pathname.includes(link) && '#fff'
        }}
        onClick={chooseMenu}
      >
        <IconMenu icon={icon} />
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
        <ButtonMenuSearch
          link="/home/search/all-people"
          icon="carbon:user-multiple"
          name="All people"
        />
        <ButtonMenuSearch
          link="/home/search/all-friends"
          icon="ant-design:user-outlined"
          name="All friends"
        />
        <ButtonMenuSearch
          link="/home/search/all-sent"
          icon="ant-design:user-delete-outlined"
          name="Sent friend requests"
        />
        <ButtonMenuSearch
          link="/home/search/all-requests"
          icon="ant-design:user-switch-outlined"
          name="All friend requests"
        />
      </BoxMenuSearch>
      <BoxContentSearch>
        <Outlet />
      </BoxContentSearch>
    </RootStyle>
  );
}

export default Search;
