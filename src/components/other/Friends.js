import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, Grid, Stack, styled, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import {
  actionGetAllFriendUser,
  actionGetAllFriendUserManual
} from '../../redux/actions/userAction';
import { db } from '../../firebase-config';
import ItemFriend from '../profile/ItemFriend';

const RootStyle = styled(Card)(({ theme }) => ({
  marginTop: '10px',
  padding: theme.spacing(1, 1, 2),
  background: '#fff'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '20px'
}));
const ButtonSeeAllFriends = styled(Button)(({ theme }) => ({
  color: theme.palette.green,
  textTransform: 'none',
  fontSize: '18px'
}));
const QuantityFriend = styled(Typography)(() => ({
  color: 'gray',
  fontSize: '18px'
}));
Friends.prototype = {
  user: PropTypes.object,
  other: PropTypes.object
};
function Friends({ user }) {
  const friendManual = useSelector((state) => state.user.friendManual);
  const [quantityMutualFriend, setQuantityMutualFriend] = useState(-1);
  const friendsOther = useSelector((state) => state.user.friendsOther);
  const dispatch = useDispatch();
  const { id } = useParams();
  const getAllFriendsSender = async () => {
    const data1 = await getDocs(
      query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
    );
    const data2 = await getDocs(
      query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
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
    return () => null;
  }, [user, friendManual]);
  const getQuantityFriend = () => {
    if (quantityMutualFriend > 0) {
      if (quantityMutualFriend === 1) return `1 mutual friend`;
      return `${quantityMutualFriend} mutual friends`;
    }
    if (friendsOther.length === 1) return `1 friend`;
    return `${friendsOther.length} friends`;
  };
  return (
    <RootStyle>
      <Stack
        direction="row"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Title>Friends</Title>
        <ButtonSeeAllFriends>See all friends</ButtonSeeAllFriends>
      </Stack>
      {friendsOther.length > 0 ? (
        <Box>
          {quantityMutualFriend >= 0 ? (
            <QuantityFriend>{getQuantityFriend()}</QuantityFriend>
          ) : null}
          <Grid sx={{ textAlign: 'center' }} container>
            {friendsOther.map((item, index) => (
              <ItemFriend key={index} friend={item} />
            ))}
          </Grid>
        </Box>
      ) : null}
    </RootStyle>
  );
}

export default Friends;
