import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
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
ItemSearchUser.prototype = {
  search: PropTypes.object
};
function ItemSearchUser({ search }) {
  const [userBySearch, setUserBySearch] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isFriend, setIsFriend] = useState(false);
  const contact = useSelector((state) => state.user.contact);
  const getContact = async (userId, otherId) => {
    const contact1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', otherId),
        where('senderId', '==', userId)
      )
    );
    const contact2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', userId),
        where('senderId', '==', otherId)
      )
    );
    if (contact1.empty && contact2.empty) {
      return setIsFriend(false);
    }
    if (!contact1.empty) {
      if (contact1.docs.at(0).data().status) {
        return setIsFriend(true);
      }
      return setIsFriend(false);
    }
    if (!contact2.empty) {
      if (contact2.docs.at(0).data().status) {
        return setIsFriend(true);
      }
      return setIsFriend(false);
    }
  };
  useEffect(() => {
    getDoc(doc(db, 'users', search.content)).then((snapshot) => {
      setUserBySearch({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
    getContact(search.userId, search.content);
    return null;
  }, []);
  const chooseSearch = () => {
    dispatch(actionGetContact(search.userId, search.content));
    navigate(`/home/other/${search.content}`);
    if (pathname.includes('/home/other/')) {
      navigate('/home/app');
      dispatch(actionTestSearch(search.content));
    }
    dispatch(actionUserCloseSearch());
    dispatch(actionUserGetUserSearch([]));
  };
  return (
    <ListItem>
      <RootStyle onClick={chooseSearch}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={userBySearch.avatar} />
          <Stack sx={{ marginLeft: '10px' }}>
            <Typography sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
              {userBySearch.username}
            </Typography>
            {isFriend ? <Typography sx={{ color: 'gray' }}>Friend</Typography> : null}
          </Stack>
        </Box>
        <IconButton>
          <Icon icon="ep:close-bold" />
        </IconButton>
      </RootStyle>
    </ListItem>
  );
}

export default ItemSearchUser;
