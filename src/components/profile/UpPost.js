import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Menu,
  MenuItem,
  Skeleton,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  actionPostOpenCreatePost,
  getAllPosts,
  actionPostOpenTagPeople
} from '../../redux/actions/postAction';
import CreatePost from '../post/CreatePost';
import TagPeople from '../post/TagPeople';
import ModalConfirmDeletePosts from '../post/ModalConfirmDeletePost';

const RootStyle = styled(Card)(({ theme }) => ({
  marginTop: '20px',
  padding: theme.spacing(1, 2, 1),
  background: '#fff'
}));
const BoxUpPost = styled(Box)(() => ({
  display: 'flex'
}));
const ButtonUpPost = styled(Button)(({ theme }) => ({
  background: theme.palette.background,
  marginLeft: '20px',
  width: `calc(100% - 50px)`,
  borderRadius: '100px',
  textTransform: 'none',
  fontSize: '18px',
  color: theme.palette.green,
  fontWeight: 'bold',
  ':hover': {
    background: 'lightgrey'
  }
}));
const BoxFilter = styled(Box)(() => ({
  marginTop: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '18px'
}));
const ButtonFilter = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '18px',
  color: theme.palette.green,
  background: theme.palette.background,
  fontWeight: 'bold',
  ':hover': {
    background: 'lightgrey'
  }
}));
UpPost.prototype = {
  user: PropTypes.object
};
function UpPost({ user }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [sort, setSort] = useState('desc');
  const isOpenCreatePost = useSelector((state) => state.post.isOpenCreatePost);
  const isOpenTagPeople = useSelector((state) => state.post.isOpenTagPeople);
  const isOpenConfirmDeletePost = useSelector((state) => state.post.isOpenConfirmDeletePost);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sortDescClick = () => {
    dispatch(getAllPosts(user.id, 'desc'));
    setSort('desc');
    handleClose();
  };
  const sortAscClick = () => {
    dispatch(getAllPosts(user.id, 'asc'));
    setSort('asc');
    handleClose();
  };
  return (
    <RootStyle>
      <BoxUpPost>
        {user.id === undefined ? (
          <Skeleton variant="circular" sx={{ width: '50px', height: '50px' }} />
        ) : (
          <Avatar sx={{ cursor: 'pointer', width: '50px', height: '50px' }} src={user.avatar} />
        )}
        <ButtonUpPost onClick={() => dispatch(actionPostOpenCreatePost())}>
          What's on your mind
        </ButtonUpPost>
      </BoxUpPost>
      <Divider sx={{ marginTop: '20px' }} />
      <BoxFilter>
        <Title>Posts</Title>
        <ButtonFilter
          id="basic-button"
          onClick={handleClick}
          startIcon={<Icon icon="bx:bx-sort" />}
        >
          Sorts by date post
        </ButtonFilter>
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={sortDescClick}>
            Descending
            {sort === 'desc' ? (
              <Icon
                style={{ marginLeft: '10px', width: '30px', height: '30px' }}
                icon="ic:baseline-done"
              />
            ) : null}
          </MenuItem>
          <MenuItem onClick={sortAscClick}>
            Ascending
            {sort !== 'desc' ? (
              <Icon
                style={{ marginLeft: '10px', width: '30px', height: '30px' }}
                icon="ic:baseline-done"
              />
            ) : null}
          </MenuItem>
        </Menu>
      </BoxFilter>
      {isOpenTagPeople ? <TagPeople user={user} /> : null}
      {isOpenCreatePost ? <CreatePost user={user} /> : null}
      {isOpenConfirmDeletePost.status ? <ModalConfirmDeletePosts /> : null}
    </RootStyle>
  );
}

export default UpPost;
