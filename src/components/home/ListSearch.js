import React, { useEffect } from 'react';
import {
  styled,
  List,
  ListItem,
  ListItemButton,
  InputBase,
  IconButton,
  Divider,
  ListItemText
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AccessTime, KeyboardBackspace, Close } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { db } from '../../firebase-config';
import { actionUserCloseSearch } from '../../redux/actions/userAction';

const RootStyle = styled(List)(({ theme }) => ({
  borderWidth: '2px',
  borderColor: '#000',
  boxShadow: 3,
  paddingBottom: '20px',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px'
}));
const SearchField = styled(InputBase)(({ theme }) => ({
  marginLeft: '10px',
  borderRadius: '20px',
  background: theme.palette.background,
  padding: theme.spacing(0.5, 2, 0.5)
}));
const ItemSearch = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
}));
function ListSearch() {
  const dataSearch = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  // const dataSearch = [];
  const dispatch = useDispatch();
  const closeSearch = () => {
    dispatch(actionUserCloseSearch());
  };
  return (
    <RootStyle sx={{ boxShadow: 10 }} disablePadding>
      <ListItem>
        <IconButton onClick={() => closeSearch()}>
          <KeyboardBackspace sx={{ color: '#000' }} />
        </IconButton>
        <SearchField placeholder="Search..." />
      </ListItem>
      <Divider sx={{ width: '80%', marginLeft: '10%' }} />
      {dataSearch.length === 0 ? (
        <ListItem sx={{ textAlign: 'center' }}>
          <ListItemText>Not found history search</ListItemText>
        </ListItem>
      ) : (
        dataSearch.map((item, index) => (
          <ItemSearch key={index}>
            <AccessTime sx={{ color: '#000' }} />
            <ListItemText sx={{ marginLeft: '10px' }}>{item}</ListItemText>
            <IconButton>
              <Close />
            </IconButton>
          </ItemSearch>
        ))
      )}
    </RootStyle>
  );
}

export default ListSearch;
