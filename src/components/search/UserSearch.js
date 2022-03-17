import React, { useEffect, useState } from 'react';
import { styled, Card, Avatar, Box, Stack, Typography, Skeleton, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '70%',
  background: '#fff',
  marginBottom: '10px',
  marginLeft: '15%',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  display: 'flex',
  alignItems: 'center'
}));
UserSearch.prototype = {
  user: PropTypes.object,
  searchId: PropTypes.string
};
function UserSearch({ user, searchId }) {
  const friendManual = useSelector((state) => state.user.friendManual);
  const searchAllPeople = useSelector((state) => state.user.searchAllPeople);
  const [userSearch, setUserSearch] = useState({});
  const [quantityMutualFriend, setQuantityMutualFriend] = useState(-1);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const getUserById = (id) => {
    getDoc(doc(db, 'users', searchId)).then((snapshot) => {
      setUserSearch({
        ...snapshot.data(),
        id: searchId
      });
    });
  };
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
      return setStatus('none');
    }
    if (!contact1.empty) {
      if (contact1.docs.at(0).data().status) {
        return setStatus('friend');
      }
      return setStatus('sent');
    }
    if (!contact2.empty) {
      if (contact2.docs.at(0).data().status) {
        return setStatus('friend');
      }
      return setStatus('received');
    }
  };
  const getAllFriendsSender = async () => {
    const data1 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('senderId', '==', searchId),
        where('status', '==', true)
      )
    );
    const data2 = await getDocs(
      query(
        collection(db, 'contacts'),
        where('receiverId', '==', searchId),
        where('status', '==', true)
      )
    );
    if (data1.empty && data2.empty) {
      setQuantityMutualFriend(0);
    }
    const contacts = [];
    data1.docs.forEach((contact) => {
      contacts.push(contact.data().receiverId);
    });
    data2.docs.forEach((contact) => {
      contacts.push(contact.data().senderId);
    });
    const temp = [];
    if (friendManual.length >= contacts.length) {
      contacts.forEach((friend) => {
        if (friendManual.includes(friend)) {
          temp.push(friend);
        }
      });
    } else {
      friendManual.forEach((friend) => {
        if (contacts.includes(friend)) {
          temp.push(friend);
        }
      });
    }
    setQuantityMutualFriend(temp.length);
  };
  useEffect(() => {
    getAllFriendsSender();
    if (user.id !== undefined) {
      getContact(user.id, searchId);
      getUserById(searchId);
    }
    return () => null;
  }, [user, friendManual, searchAllPeople]);
  const BoxMutualFriend = () => {
    if (quantityMutualFriend < 0)
      return <Skeleton variant="text" sx={{ width: '100px', height: '15px' }} />;
    if (quantityMutualFriend === 1)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon style={{ color: 'gray' }} icon="fa-solid:user-friends" />
          <Typography sx={{ color: 'gray', fontFamily: 'inherit', marginLeft: '5px' }}>
            1 mutual friend
          </Typography>
        </Box>
      );
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon style={{ color: 'gray' }} icon="fa-solid:user-friends" />
        <Typography sx={{ color: 'gray', fontFamily: 'inherit', marginLeft: '5px' }}>
          {quantityMutualFriend} mutual friend
        </Typography>
      </Box>
    );
  };
  const chooseUserSearch = () => {
    navigate(`/home/other/${userSearch.id}`);
  };
  if (status === '')
    return (
      <RootStyle>
        <Box sx={{ display: 'flex' }}>
          <Skeleton sx={{ width: '70px', height: '70px' }} variant="circular" />
          <Stack sx={{ marginLeft: '10px' }}>
            <Skeleton sx={{ width: '150px', height: '22px' }} variant="text" />
            <Skeleton sx={{ width: '80px', height: '18px' }} variant="text" />
            <Skeleton sx={{ width: '100px', height: '20px' }} variant="text" />
          </Stack>
        </Box>
        <Skeleton variant="circular" sx={{ width: '50px', height: '50px' }} />
      </RootStyle>
    );
  return (
    <RootStyle elevation={3}>
      <Box sx={{ display: 'flex' }}>
        <Avatar
          onClick={chooseUserSearch}
          sx={{ width: '70px', height: '70px', cursor: 'pointer' }}
          src={userSearch.avatar}
        />
        <Stack sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontWeight: 'bold', fontFamily: 'inherit', fontSize: '18px' }}>
            {userSearch.username}
          </Typography>
          {status === 'friend' && (
            <Typography sx={{ color: 'gray', fontFamily: 'inherit' }}>Friend</Typography>
          )}
          {quantityMutualFriend !== 0 && <BoxMutualFriend />}
        </Stack>
      </Box>
      {status === 'friend' && (
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <Icon style={{ width: '40px', height: '40px' }} icon="uil:comment-message" />
        </IconButton>
      )}
      {status === 'sent' && (
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <Icon style={{ width: '40px', height: '40px' }} icon="bx:bxs-user-x" />
        </IconButton>
      )}
      {status === 'received' && (
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <Icon style={{ width: '40px', height: '40px' }} icon="bx:bxs-user-check" />
        </IconButton>
      )}
      {status === 'none' && (
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <Icon style={{ width: '40px', height: '40px' }} icon="bx:bxs-user-plus" />
        </IconButton>
      )}
    </RootStyle>
  );
}

export default UserSearch;
