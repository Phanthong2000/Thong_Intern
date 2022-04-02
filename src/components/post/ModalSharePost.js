import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  Modal,
  Popover,
  styled,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { addDoc, collection } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  actionOpenSnackbar,
  actionPostClearTags,
  actionPostCloseCreatePost,
  actionPostModalSharePost,
  getAllPosts
} from '../../redux/actions/postAction';

import { db } from '../../firebase-config';
import {
  actionUserCloseLoadingUpdateProfile,
  actionUserOpenLoadingUpdateProfile
} from '../../redux/actions/userAction';

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
const BoxInfoUser = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex'
}));
const ButtonStatus = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeigh: 'bold',
  color: '#000',
  fontSize: '13px',
  fontWeight: 'bold',
  background: 'lightgrey',
  padding: '2px 5px',
  ':hover': {
    background: 'lightgrey'
  }
}));
const IconStatus = styled(Icon)(({ theme }) => ({
  width: '15px',
  height: '15px'
}));
const InputShare = styled(InputBase)(({ theme }) => ({
  width: '100%'
}));
const ButtonPost = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  color: '#fff',
  fontSize: '16px',
  background: theme.palette.green,
  fontWeight: 'bold',
  marginTop: '10px',
  ':hover': {
    background: 'green'
  }
}));
const DotOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  width: '20px',
  height: '20px',
  bottom: '5px',
  right: '5px',
  color: theme.palette.green
}));
ModalSharePost.prototype = {
  user: PropTypes.object
};
function ModalSharePost({ user }) {
  const modalSharePost = useSelector((state) => state.post.modalSharePost);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const navigate = useNavigate();
  const [contentText, setContentText] = useState('');
  const [status, setStatus] = useState('public');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(
      actionPostModalSharePost({
        status: false,
        post: {},
        userPost: {}
      })
    );
  };
  const DatePost = () => {
    const DateTime = styled(Typography)(() => ({
      fontSize: '14px',
      color: 'grey'
    }));
    if (new Date().getTime() - modalSharePost.post.createdAt < 86400000)
      return <DateTime>{moment(modalSharePost.post.createdAt).fromNow()}</DateTime>;
    return <DateTime>{moment(modalSharePost.post.createdAt).format('MMMM D, YYYY')}</DateTime>;
  };
  const BoxPostText = () => {
    const PostText = styled(Box)(({ theme }) => ({
      width: '100%',
      maxHeight: '300px',
      display: 'flex'
    }));
    const BoxContent = styled(Box)(({ theme }) => ({
      width: '100%',
      border: `1px solid gray`,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#fff'
    }));
    const BoxInfo = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }));
    return (
      <PostText>
        <Scrollbar>
          <BoxContent>
            <BoxInfo>
              <IconButton disabled>
                <Avatar
                  sx={{ width: '50px', height: '50px' }}
                  src={modalSharePost.userPost.avatar}
                />
                <DotOnline
                  icon="ci:dot-05-xl"
                  style={{
                    color:
                      usersSocket.find((socket) => socket.userId === modalSharePost.userPost.id) ===
                      undefined
                        ? 'gray'
                        : null
                  }}
                />
              </IconButton>
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {modalSharePost.userPost.username}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePost />
                  <Icon
                    style={{ color: 'gray', width: '15px', height: '15px' }}
                    icon="ci:dot-01-xs"
                  />
                  <Icon
                    style={{ color: 'gray', width: '15px', height: '15px' }}
                    icon="gis:earth-australia-o"
                  />
                </Box>
              </Box>
            </BoxInfo>
            <Typography>{modalSharePost.post.contentText}</Typography>
          </BoxContent>
        </Scrollbar>
      </PostText>
    );
  };
  const BoxPostImage = () => {
    const PostImage = styled(Box)(({ theme }) => ({
      width: '100%',
      maxHeight: '300px',
      display: 'flex'
    }));
    const Image = styled('img')(({ theme }) => ({
      width: '100%',
      outline: `1px solid gray`
    }));
    const BoxContent = styled(Box)(({ theme }) => ({
      width: '100%',
      border: `1px solid gray`,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#fff'
    }));
    const BoxInfo = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }));
    return (
      <PostImage>
        <Scrollbar>
          <BoxContent>
            <Image src={modalSharePost.post.contentFile} />
            <BoxInfo>
              <IconButton disabled>
                <Avatar src={modalSharePost.userPost.avatar} />
                <DotOnline
                  icon="ci:dot-05-xl"
                  style={{
                    color:
                      usersSocket.find((socket) => socket.userId === modalSharePost.userPost.id) ===
                      undefined
                        ? 'gray'
                        : null
                  }}
                />
              </IconButton>
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {modalSharePost.userPost.username}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePost />
                  <Icon
                    style={{ color: 'gray', width: '15px', height: '15px' }}
                    icon="ci:dot-01-xs"
                  />
                  <Icon
                    style={{ color: 'gray', width: '15px', height: '15px' }}
                    icon="gis:earth-australia-o"
                  />
                </Box>
              </Box>
            </BoxInfo>
            <Typography>{modalSharePost.post.contentText}</Typography>
          </BoxContent>
        </Scrollbar>
      </PostImage>
    );
  };
  const BoxPostBackground = () => {
    const PostText = styled(Box)(({ theme }) => ({
      width: '100%',
      maxHeight: '300px',
      display: 'flex'
    }));
    const BoxContent = styled(Box)(({ theme }) => ({
      width: '100%',
      border: `1px solid gray`,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#fff'
    }));
    const BoxInfo = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }));
    return (
      <PostText>
        <Scrollbar>
          <BoxContent>
            <BoxInfo>
              <IconButton disabled>
                <Avatar
                  sx={{ width: '50px', height: '50px' }}
                  src={modalSharePost.userPost.avatar}
                />
                <DotOnline
                  icon="ci:dot-05-xl"
                  style={{
                    color:
                      usersSocket.find((socket) => socket.userId === modalSharePost.userPost.id) ===
                      undefined
                        ? 'gray'
                        : null
                  }}
                />
              </IconButton>
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {modalSharePost.userPost.username}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePost />
                  <Icon
                    style={{ color: 'gray', width: '15px', height: '15px' }}
                    icon="ci:dot-01-xs"
                  />
                  <Icon
                    style={{ color: 'gray', width: '15px', height: '15px' }}
                    icon="gis:earth-australia-o"
                  />
                </Box>
              </Box>
            </BoxInfo>
            <Box
              sx={{
                width: '100%',
                height: '300px',
                backgroundImage: `url(${modalSharePost.post.background})`,
                backgroundSize: `100% 100%`,
                backgroundRepeat: 'no-repeat',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography
                sx={{ fontWeight: 'bold', fontSize: '20px', color: modalSharePost.post.textColor }}
              >
                {modalSharePost.post.contentText}
              </Typography>
            </Box>
          </BoxContent>
        </Scrollbar>
      </PostText>
    );
  };
  const post = () => {
    const post = {
      contentText,
      reactions: [],
      shares: [],
      userId: user.id,
      status,
      tags: [],
      type: 'share',
      createdAt: new Date().getTime(),
      post: modalSharePost.post
    };
    handleCloseModal();
    dispatch(actionUserOpenLoadingUpdateProfile());
    addDoc(collection(db, 'posts'), post)
      .then(() => {
        dispatch(actionPostClearTags());
        dispatch(actionUserCloseLoadingUpdateProfile());
        dispatch(getAllPosts(user.id, 'desc'));
        dispatch(actionPostCloseCreatePost());
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Share post success',
            type: 'success'
          })
        );
      })
      .then(() => {
        navigate('/home/app');
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal open={modalSharePost.status} onClose={handleCloseModal}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Share post</Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Divider sx={{ margin: '10px 0px' }} />
        <BoxInfoUser>
          <Avatar sx={{ width: '50px', height: '50px' }} src={user.avatar} />
          <Box sx={{ marginLeft: '10px' }}>
            <Typography sx={{ fontWeight: 'bold' }}>{user.username}</Typography>
            {status === 'public' ? (
              <ButtonStatus
                onClick={handleClick}
                startIcon={<IconStatus icon="gis:earth-australia-o" />}
                endIcon={<IconStatus icon="ant-design:caret-down-filled" />}
              >
                Public
              </ButtonStatus>
            ) : (
              <ButtonStatus
                onClick={handleClick}
                startIcon={<IconStatus icon="dashicons:lock" />}
                endIcon={<IconStatus icon="ant-design:caret-down-filled" />}
              >
                Only me
              </ButtonStatus>
            )}
            <Popover
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              sx={{ display: 'block' }}
            >
              <Card sx={{ background: '#fff', display: 'block' }}>
                <Button
                  onClick={() => {
                    setStatus('public');
                    handleClose();
                  }}
                  sx={{
                    background: '#fff',
                    textTransform: 'none',
                    fontSize: '18px',
                    color: '#000'
                  }}
                  startIcon={<Icon icon="si-glyph:global" />}
                  endIcon={status === 'public' ? <Icon icon="ic:baseline-done" /> : null}
                >
                  Public
                </Button>
                <Button
                  onClick={() => {
                    setStatus('private');
                    handleClose();
                  }}
                  sx={{
                    background: '#fff',
                    textTransform: 'none',
                    fontSize: '18px',
                    color: '#000'
                  }}
                  startIcon={<Icon icon="entypo:lock" />}
                  endIcon={status === 'private' ? <Icon icon="ic:baseline-done" /> : null}
                >
                  Only me
                </Button>
              </Card>
            </Popover>
          </Box>
        </BoxInfoUser>
        <InputShare
          minRows={5}
          maxRows={5}
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          multiline
          fullWidth
          placeholder={`What's on your mind, ${user.username}`}
        />
        {modalSharePost.post.type === 'text' && <BoxPostText />}
        {modalSharePost.post.type === 'background' && <BoxPostBackground />}
        {(modalSharePost.post.type === 'image' || modalSharePost.post.type === 'avatar') && (
          <BoxPostImage />
        )}
        <ButtonPost onClick={post}>Post</ButtonPost>
      </BoxModal>
    </Modal>
  );
}

export default ModalSharePost;
