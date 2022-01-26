import React from 'react';
import { IconButton, styled, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { actionUserOpenSearch } from '../../redux/actions/userAction';
import Responsive from '../../responsive/Responsive';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  color: theme.palette.green,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 2, 1),
    background: theme.palette.background,
    borderRadius: '30px',
    width: '200px'
  }
}));
function SearchBar() {
  const dispatch = useDispatch();
  const search = () => {
    dispatch(actionUserOpenSearch());
  };
  return (
    <RootStyle onClick={() => search()}>
      <Responsive width="smUp">
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Search />
        </IconButton>
      </Responsive>
      <Responsive width="smDown">
        <Search sx={{ marginRight: '20px' }} />
        <Typography>Search...</Typography>
      </Responsive>
    </RootStyle>
  );
}

export default SearchBar;
