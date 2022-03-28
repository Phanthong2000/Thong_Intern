import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  actionGetContact,
  actionTestSearch,
  actionUserCloseSearch,
  actionUserGetUserSearch
} from '../../redux/actions/userAction';

const RootStyle = styled(ListItemButton)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
}));
ItemSearchGroup.prototype = {
  search: PropTypes.object
};
function ItemSearchGroup({ search }) {
  const [userBySearch, setUserBySearch] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (search.type === 'group') {
      getDoc(doc(db, 'groups', search.content)).then((snapshot) => {
        setUserBySearch({
          ...snapshot.data(),
          id: snapshot.id
        });
      });
    }
    return () => null;
  }, [search]);
  const chooseSearch = () => {
    dispatch(actionGetContact(search.userId, search.content));
    navigate(`/home/groups/${search.content}`);
    dispatch(actionUserCloseSearch());
    dispatch(actionUserGetUserSearch([]));
  };
  if (userBySearch.avatar === undefined)
    return (
      <RootStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton sx={{ width: '40px', height: '40px' }} variant="circular" />
          <Stack sx={{ marginLeft: '10px' }}>
            <Skeleton variant="text" sx={{ width: '100px', height: '20px' }} />
            <Skeleton variant="text" sx={{ width: '50px', height: '16px' }} />
          </Stack>
        </Box>
      </RootStyle>
    );
  return (
    <ListItem>
      <RootStyle onClick={chooseSearch}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: '40px', height: '40px' }} src={userBySearch.avatar} />
          <Stack sx={{ marginLeft: '10px' }}>
            <Typography sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
              {userBySearch.name}
            </Typography>
            <Typography sx={{ color: 'gray' }}>Group</Typography>
          </Stack>
        </Box>
        <IconButton>
          <Icon icon="ep:close-bold" />
        </IconButton>
      </RootStyle>
    </ListItem>
  );
}

export default ItemSearchGroup;
