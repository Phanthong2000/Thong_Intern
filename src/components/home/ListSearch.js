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
  Typography
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AccessTime, KeyboardBackspace, Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../firebase-config';
import { actionUserCloseSearch, actionUserGetUserSearch } from '../../redux/actions/userAction';
import ItemSearchUser from './ItemSearchUser';
import ItemSearchText from './ItemSearchText';

const RootStyle = styled(List)(({ theme }) => ({
  borderWidth: '2px',
  borderColor: '#000',
  boxShadow: 3,
  paddingBottom: '20px',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  maxHeight: '650px'
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
  const [historySearch, setHistorySearch] = useState([]);
  const [isSearch, setSearch] = useState(false);
  const dispatch = useDispatch();
  const search = useSelector((state) => state.user.search);
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
      setHistorySearch(searchs);
      dispatch(actionUserGetUserSearch(searchSort));
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
    });
  };
  useEffect(() => {
    getHistorySearch();
    getAllUser();
    return null;
  }, [user]);
  const closeSearch = () => {
    dispatch(actionUserCloseSearch());
  };
  const inputSearch = (e) => {
    inputCommentRef.current = e.target.value;
    if (inputCommentRef.current) {
      const newDataAllUser = searchAllUser.filter((item) => {
        const itemData = item.username ? item.username.toUpperCase() : ''.toUpperCase();
        const textData = inputCommentRef.current.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      const filterData = [];
      newDataAllUser.forEach((data) => {
        filterData.push({
          userId: user.id,
          createdAt: new Date().getTime(),
          content: data.id,
          type: 'user'
        });
      });
      dispatch(actionUserGetUserSearch(filterData));
      setSearch(true);
    } else {
      getHistorySearch();
      setSearch(false);
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
      {search.length === 0 ? (
        <ListItem sx={{ textAlign: 'center' }}>
          <ListItemText>Not found history search</ListItemText>
        </ListItem>
      ) : (
        search.map((item, index) => {
          if (item.type === 'user') return <ItemSearchUser key={index} search={item} />;
          return <ItemSearchText key={index} search={item} />;
        })
      )}
      {isSearch ? (
        <ListItem sx={{ maxWidth: '400px' }}>
          <ListItemButton>
            <Icon
              icon="ion:search-circle"
              style={{ width: '40px', height: '40px', color: '#30ab78' }}
            />
            <Typography sx={{ maxWidth: '400px' }}>
              Search for <b>{inputCommentRef.current}</b>
            </Typography>
          </ListItemButton>
        </ListItem>
      ) : null}
    </RootStyle>
  );
}

export default ListSearch;
