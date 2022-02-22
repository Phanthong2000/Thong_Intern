import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Modal,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getDoc, doc } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { db } from '../../firebase-config';
import { actionPostCloseTagPeople } from '../../redux/actions/postAction';
import ItemSuggestion from './ItemSuggestion';
import ChipTag from './ChipTag';

const BoxModal = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2),
  display: 'block',
  height: '500px'
}));
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1)
}));
const ButtonDone = styled(Button)(({ theme }) => ({
  color: theme.palette.green,
  textTransform: 'none',
  fontSize: '18px'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 2, 0.5),
  background: theme.palette.background,
  display: 'flex',
  alignItems: 'center',
  width: '90%',
  borderRadius: '20px'
}));
const InputSearch = styled(InputBase)(() => ({
  width: '90%',
  marginLeft: '5px'
}));
const BoxTag = styled(Grid)(({ theme }) => ({
  border: `1px solid lightgrey`,
  padding: theme.spacing(1, 1, 1),
  minHeight: '50px',
  maxHeight: '100px',
  overflow: 'auto'
}));
const BoxSuggestion = styled(Box)(() => ({
  maxHeight: '250px',
  marginTop: '10px',
  display: 'flex'
}));
TagPeople.prototype = {
  user: PropTypes.object
};
function TagPeople({ user }) {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.post.tags);
  const isOpenTagPeople = useSelector((state) => state.post.isOpenTagPeople);
  const friends = useSelector((state) => state.user.friends);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    getSuggestions();
    return () => null;
  }, [user]);
  const getSuggestions = () => {
    const data = [];
    friends.forEach((friend) => {
      getDoc(doc(db, 'users', friend.friendId)).then((snapshot) => {
        data.push({
          ...snapshot.data(),
          id: snapshot.id
        });
        if (data.length === friends.length) setSuggestions(data);
      });
    });
  };
  return (
    <Modal open={isOpenTagPeople} onClose={() => dispatch(actionPostCloseTagPeople())}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => dispatch(actionPostCloseTagPeople())}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="bi:arrow-left" />
          </IconButton>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '100px' }}>
            Tag people
          </Typography>
        </Box>
        <Separate />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BoxSearch>
            <Icon style={{ width: '20px', height: '20px', color: 'grey' }} icon="fe:search" />
            <InputSearch placeholder="Search for friends" />
          </BoxSearch>
          <ButtonDone onClick={() => dispatch(actionPostCloseTagPeople())}>Done</ButtonDone>
        </Box>
        <Box>
          <Typography sx={{ color: 'gray', fontSize: '14px' }}>TAGGED</Typography>
          <BoxTag container>
            {tags.map((item, index) => (
              <ChipTag tag={item} index={index} key={index} />
            ))}
          </BoxTag>
        </Box>
        <BoxSuggestion>
          <Scrollbar alwaysShowTracks>
            <Typography sx={{ color: 'gray', fontSize: '14px' }}>SUGGESTIONS</Typography>
            {suggestions.map((item, index) => (
              <ItemSuggestion key={index} friend={item} />
            ))}
          </Scrollbar>
        </BoxSuggestion>
      </BoxModal>
    </Modal>
  );
}

export default TagPeople;
