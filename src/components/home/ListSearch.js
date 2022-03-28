import React, { useEffect, useRef, useState } from 'react';
import {
  styled,
  List,
  ListItem,
  ListItemButton,
  InputBase,
  IconButton,
  Divider,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AccessTime, KeyboardBackspace, Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scrollbar } from 'smooth-scrollbar-react';
import { db } from '../../firebase-config';
import {
  actionSearchAllFriendRequests,
  actionSearchAllFriends,
  actionSearchAllPeople,
  actionSearchAllSent,
  actionUserCloseSearch,
  actionUserGetUserSearch
} from '../../redux/actions/userAction';
import ItemSearchUser from './ItemSearchUser';
import ItemSearchText from './ItemSearchText';
import ItemSearchPage from './ItemSearchPage';
import ItemSearchGroup from './ItemSearchGroup';

const RootStyle = styled(List)(({ theme }) => ({
  borderWidth: '2px',
  borderColor: '#000',
  boxShadow: 3,
  paddingBottom: '20px',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  maxHeight: '750px'
}));
const SearchField = styled(InputBase)(({ theme }) => ({
  marginLeft: '10px',
  borderRadius: '20px',
  background: theme.palette.background,
  padding: theme.spacing(0.5, 2, 0.5)
}));
ListSearch.prototype = {
  user: PropTypes.object
};
function ListSearch({ user }) {
  const inputCommentRef = useRef('');
  const [searchAllUser, setSearchAllUser] = useState([]);
  const [searchAllPages, setSearchAllPages] = useState([]);
  const [searchAllGroups, setSearchAllGroups] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchAllPeople = useSelector((state) => state.user.searchAllPeople);
  const getHistorySearch = async () => {
    const data = await getDocs(query(collection(db, 'searchs'), where('userId', '==', user.id)));
    if (!data.empty) {
      const searchs = [];
      data.docs.forEach((search) => {
        searchs.push({
          ...search.data(),
          id: search.id
        });
      });
      const searchSort = searchs.sort((a, b) => b.createdAt - a.createdAt);
      setSearch(searchSort);
    }
  };
  const getAllUser = async () => {
    const data = await getDocs(collection(db, 'users'));
    const users = [];
    data.docs.forEach((doc) => {
      if (user.id !== doc.id) {
        users.push({
          ...doc.data(),
          id: doc.id
        });
      }
      setSearchAllUser(users);
      setSearch(users);
    });
  };
  const getAllPages = async () => {
    const data = await getDocs(query(collection(db, 'pages'), where('userCreate', '!=', user.id)));
    if (!data.empty) {
      const pages = [];
      data.docs.forEach((page) => {
        pages.push({
          ...page.data(),
          id: page.id
        });
      });
      setSearchAllPages(pages);
    }
  };
  const getAllGroups = async () => {
    const data = await getDocs(query(collection(db, 'groups'), where('userCreate', '!=', user.id)));
    if (!data.empty) {
      const pages = [];
      data.docs.forEach((page) => {
        pages.push({
          ...page.data(),
          id: page.id
        });
      });
      setSearchAllGroups(pages);
    }
  };
  useEffect(() => {
    // getHistorySearch();
    getAllUser();
    getAllPages();
    getAllGroups();
    return () => null;
  }, [user]);
  const closeSearch = () => {
    dispatch(actionUserCloseSearch());
  };
  const chooseSearchForText = () => {
    // dispatch(actionSearchAllPeople(inputCommentRef.current, user.id));
    // dispatch(actionSearchAllFriends(inputCommentRef.current, user.id));
    // dispatch(actionSearchAllSent(inputCommentRef.current, user.id));
    // dispatch(actionSearchAllFriendRequests(inputCommentRef.current, user.id));
    dispatch(actionUserCloseSearch());
    // if (pathname.includes(`/home/search`)) {
    //   navigate(`/home/search/all-people/${inputCommentRef.current}`);
    //   window.location.reload();
    // } else
    navigate(`/home/search/all-people/${inputCommentRef.current}`);
  };
  const inputSearch = (e) => {
    inputCommentRef.current = e.target.value;
    if (e.target.value) {
      const data = [];
      searchAllUser.forEach((userSearch) => {
        if (userSearch.username.toLowerCase().includes(e.target.value.toLowerCase())) {
          data.push({
            userId: user.id,
            createdAt: new Date().getTime(),
            content: userSearch.id,
            type: 'user'
          });
        }
      });
      searchAllPages.forEach((userSearch) => {
        if (userSearch.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          data.push({
            userId: user.id,
            createdAt: new Date().getTime(),
            content: userSearch.id,
            type: 'page'
          });
        }
      });
      searchAllGroups.forEach((userSearch) => {
        if (userSearch.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          data.push({
            userId: user.id,
            createdAt: new Date().getTime(),
            content: userSearch.id,
            type: 'group'
          });
        }
      });
      setSearch(data);
      setIsSearch(true);
    } else {
      setSearch([]);
      // getAllUser();
      // getHistorySearch();
      setIsSearch(false);
    }
  };
  return (
    <RootStyle sx={{ boxShadow: 10 }} disablePadding>
      <ListItem>
        <IconButton onClick={() => closeSearch()}>
          <KeyboardBackspace sx={{ color: '#000' }} />
        </IconButton>
        <SearchField
          ref={inputCommentRef}
          onChange={(e) => inputSearch(e)}
          placeholder="Search..."
        />
      </ListItem>
      <Divider sx={{ width: '80%', marginLeft: '10%' }} />
      <Box sx={{ maxHeight: '600px', display: 'flex' }}>
        <Scrollbar alwaysShowTracks>
          {search.length === 0 && isSearch ? (
            <ListItem sx={{ textAlign: 'center' }}>
              <ListItemText>Not found user</ListItemText>
            </ListItem>
          ) : (
            search.map((item, index) => {
              if (item.type === 'user') return <ItemSearchUser key={index} search={item} />;
              if (item.type === 'page') return <ItemSearchPage key={index} search={item} />;
              if (item.type === 'group') return <ItemSearchGroup key={index} search={item} />;
              return null;
            })
          )}
        </Scrollbar>
      </Box>

      {isSearch && (
        <ListItem sx={{ maxWidth: '400px' }}>
          <ListItemButton onClick={chooseSearchForText}>
            <Icon
              icon="ion:search-circle"
              style={{ width: '40px', height: '40px', color: '#30ab78' }}
            />
            <Typography sx={{ maxWidth: '400px' }}>
              Search for <b>{inputCommentRef.current}</b>
            </Typography>
          </ListItemButton>
        </ListItem>
      )}
    </RootStyle>
  );
}

export default ListSearch;
