import React from 'react';
import { Box, Button, Card, Divider, IconButton, Modal, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDoc, doc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import {
  actionPostCloseConfirmDeletePost,
  getAllPosts,
  actionOpenSnackbar
} from '../../redux/actions/postAction';
import {
  actionUserOpenLoadingUpdateProfile,
  actionUserCloseLoadingUpdateProfile,
  actionUserScrollTop
} from '../../redux/actions/userAction';
import { db } from '../../firebase-config';

const BoxModal = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
const ButtonCancel = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '16px',
  fontFamily: 'sans-serif',
  color: theme.palette.green,
  fontWeight: 'bold',
  padding: theme.spacing(0.5, 2, 0.5),
  marginRight: '10px'
}));
const ButtonDelete = styled(Button)(({ theme }) => ({
  color: '#fff',
  textTransform: 'none',
  fontFamily: 'sans-serif',
  background: theme.palette.green,
  padding: theme.spacing(0.5, 2, 0.5),
  fontWeight: 'bold',
  fontSize: '16px',
  ':hover': {
    background: theme.palette.green
  }
}));
function ModalConfirmDeletePost() {
  const dispatch = useDispatch();
  const isOpenConfirmDeletePost = useSelector((state) => state.post.isOpenConfirmDeletePost);
  const { id } = useParams();
  const confirmDeletePost = () => {
    dispatch(actionUserScrollTop());
    dispatch(actionPostCloseConfirmDeletePost());
    dispatch(actionUserOpenLoadingUpdateProfile());
    deleteDoc(doc(db, 'posts', isOpenConfirmDeletePost.postId)).then(() => {
      dispatch(actionUserCloseLoadingUpdateProfile());
      dispatch(getAllPosts(id, 'desc'));
      dispatch(
        actionOpenSnackbar({
          status: true,
          type: 'success',
          content: 'Successfully deleted post'
        })
      );
    });
  };
  return (
    <Modal
      open={isOpenConfirmDeletePost.status}
      onClose={() => dispatch(actionPostCloseConfirmDeletePost())}
    >
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Delete post</Typography>
          <IconButton
            onClick={() => dispatch(actionPostCloseConfirmDeletePost())}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Divider sx={{ margin: `10px 0px` }} />
        <Box>
          <Typography sx={{ fontSize: '18px', fontFamily: 'inherit' }}>
            After delete post can't restore
          </Typography>
        </Box>
        <Box sx={{ justifyContent: 'right', display: 'flex' }}>
          <ButtonCancel onClick={() => dispatch(actionPostCloseConfirmDeletePost())}>
            Cancel
          </ButtonCancel>
          <ButtonDelete onClick={confirmDeletePost}>Delete</ButtonDelete>
        </Box>
      </BoxModal>
    </Modal>
  );
}

export default ModalConfirmDeletePost;
