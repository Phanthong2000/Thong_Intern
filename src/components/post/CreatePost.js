import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Snackbar,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useDispatch, useSelector } from 'react-redux';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { trimEnd } from 'lodash';
import {
  actionUserCloseLoadingUpdateProfile,
  actionUserOpenLoadingUpdateProfile
} from '../../redux/actions/userAction';
import { db, storage } from '../../firebase-config';
import {
  actionOpenSnackbar,
  actionPostCloseCreatePost,
  actionPostOpenTagPeople,
  actionPostClearTags,
  getAllPosts,
  actionGetAllPostAllFriend
} from '../../redux/actions/postAction';
import backgrounds from '../../asset/data/backgrounds';
import EmojiIconMessage from '../chat/EmojiIconMessage';

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
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1)
}));
const Content = styled(Box)(() => ({
  marginTop: '10px',
  minHeight: '300px'
}));
const InputContent = styled(InputBase)(() => ({
  fontSize: '20px',
  fontFamily: 'inherit',
  minHeight: '160px',
  maxHeight: '300px',
  minWidth: '50%'
}));
const BoxOptions = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0, 1, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const ImagePost = styled('img')(() => ({
  height: '400px',
  width: '100%'
}));
const ButtonPost = styled(Button)(({ theme }) => ({
  width: '100%',
  background: theme.palette.green,
  fontFamily: 'inherit',
  fontWeight: 'bold',
  color: '#fff',
  textTransform: 'none',
  marginTop: '10px',
  fontSize: '18px',
  ':hover': {
    backgroundColor: theme.palette.green
  }
}));
CreatePost.prototype = {
  user: PropTypes.object
};
function CreatePost({ user }) {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState('');
  const isOpenCreatePost = useSelector((state) => state.post.isOpenCreatePost);
  const [status, setStatus] = useState('public');
  const [type, setType] = useState('text');
  const [background, setBackground] = useState('');
  const [textColor, setTextColor] = useState('');
  const [textColorBackground, setTextColorBackground] = useState('');
  const [contentText, setContentText] = useState('');
  const [image, setImage] = useState();
  const tags = useSelector((state) => state.post.tags);
  const [anchorElEmoji, setAnchorElEmoji] = React.useState(null);
  const openEmoji = Boolean(anchorElEmoji);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickEmoji = (event) => {
    setAnchorElEmoji(event.currentTarget);
  };

  const handleCloseEmoji = () => {
    setAnchorElEmoji(null);
  };
  const chooseText = () => {
    setDisabled('');
    setType('text');
    setBackground('');
  };
  const chooseBackground = () => {
    setDisabled('image');
    setType('background');
  };
  const chooseImage = () => {
    fileRef.current.click();
  };
  const onChangeFile = (files) => {
    if (files && files[0]) {
      if (files[0].size < 5242880) {
        setImage(files[0]);
        setDisabled('background');
        setType('image');
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Profile picture photo must less than 5MB',
            type: 'error'
          })
        );
      }
    }
  };
  const checkDisablePost = () => {
    if (type === 'image' && image.name.length > 0) return false;
    if (type === 'background' && contentText.length > 0) return false;
    if (type === 'text' && contentText.length > 0) return false;
    return true;
  };
  const deleteImagePost = () => {
    setDisabled('');
    setType('text');
    setBackground('');
  };
  const savePost = () => {
    const tagIds = [];
    tags.forEach((tag) => tagIds.push({ userId: tag.id }));
    if (type === 'text') {
      console.log('text');
      const post = {
        contentText,
        reactions: [],
        shares: [],
        userId: user.id,
        status,
        tags: tagIds,
        type: 'text',
        createdAt: new Date().getTime()
      };
      window.scrollTo(0, 0);
      dispatch(actionUserOpenLoadingUpdateProfile());
      addDoc(collection(db, 'posts'), post)
        .then(() => {
          dispatch(actionGetAllPostAllFriend(user.id));
          dispatch(actionPostClearTags());
          dispatch(actionUserCloseLoadingUpdateProfile());
          dispatch(getAllPosts(user.id, 'desc'));
          dispatch(actionPostCloseCreatePost());
          dispatch(
            actionOpenSnackbar({
              status: true,
              content: 'Post success',
              type: 'success'
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === 'background') {
      const post = {
        contentText,
        background,
        reactions: [],
        shares: [],
        userId: user.id,
        status,
        textColor,
        tags: tagIds,
        type: 'background',
        createdAt: new Date().getTime()
      };
      window.scrollTo(0, 0);
      dispatch(actionUserOpenLoadingUpdateProfile());
      addDoc(collection(db, 'posts'), post)
        .then(() => {
          dispatch(actionGetAllPostAllFriend(user.id));
          dispatch(actionPostClearTags());
          dispatch(actionUserCloseLoadingUpdateProfile());
          dispatch(getAllPosts(user.id, 'desc'));
          dispatch(actionPostCloseCreatePost());
          dispatch(
            actionOpenSnackbar({
              status: true,
              content: 'Post success',
              type: 'success'
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('image');
      const metadata = {
        contentType: 'image/*'
      };
      const storageRef = ref(storage, `post/${user.id}.${new Date().getTime()}`);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          switch (snapshot.state) {
            case 'running':
              dispatch(actionPostCloseCreatePost());
              window.scrollTo(0, 0);
              dispatch(actionUserOpenLoadingUpdateProfile());
              break;
            default:
              console.log('ok');
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const post = {
              contentFile: downloadURL,
              contentText,
              reactions: [],
              shares: [],
              userId: user.id,
              status,
              tags: tagIds,
              type: 'image',
              createdAt: new Date().getTime()
            };
            addDoc(collection(db, 'posts'), post)
              .then(() => {
                dispatch(actionGetAllPostAllFriend(user.id));
                dispatch(actionPostClearTags());
                dispatch(actionUserCloseLoadingUpdateProfile());
                dispatch(getAllPosts(user.id, 'desc'));
                dispatch(
                  actionOpenSnackbar({
                    status: true,
                    content: 'Post success',
                    type: 'success'
                  })
                );
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
    }
  };
  const BoxBackground = () => {
    const RootStyle = styled(Grid)(() => ({
      width: '100%'
    }));
    const Item = styled('img')(({ theme }) => ({
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      ':hover': {
        border: `2px solid ${theme.palette.green}`
      }
    }));
    return (
      <RootStyle container>
        <Grid onClick={chooseText} sx={{ padding: '1px' }} item xs={1} sm={1} md={1} lg={1} xl={1}>
          <Item />
        </Grid>
        {backgrounds.map((item, index) => {
          const onChooseBackground = () => {
            setTextColor(item.textColor);
            setBackground(item.url);
            setTextColorBackground(item.textColor);
          };
          return (
            <Grid sx={{ padding: '1px' }} key={index} item xs={1} sm={1} md={1} lg={1} xl={1}>
              <Item onClick={onChooseBackground} src={item.url} />
            </Grid>
          );
        })}
      </RootStyle>
    );
  };
  const chooseEmoji = (emoji) => {
    setContentText(contentText.concat(emoji));
  };
  return (
    <Modal open={isOpenCreatePost} onClose={() => dispatch(actionPostCloseCreatePost())}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Create post</Typography>
          <IconButton
            onClick={() => dispatch(actionPostCloseCreatePost())}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Separate />
        <Grid container spacing={2}>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            <Avatar src={user.avatar} />
          </Grid>
          <Grid sx={{ marginLeft: '10px' }} item xs={10} sm={10} md={10} lg={10} xl={10}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '14px' }}>
                {user.username}
              </Typography>
              <Button
                onClick={handleClick}
                sx={{
                  width: '100px',
                  textTransform: 'none',
                  background: '#f5f7f6',
                  color: '#000',
                  height: '20px',
                  '&:hover': {
                    background: '#f5f7f6'
                  }
                }}
              >
                {status === 'public' ? (
                  <>
                    <Icon icon="si-glyph:global" />
                    <Typography sx={{ marginLeft: '5px' }}>Public</Typography>
                  </>
                ) : (
                  <>
                    <Icon icon="entypo:lock" />
                    <Typography sx={{ marginLeft: '5px' }}>Only me</Typography>
                  </>
                )}
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Content
          sx={{
            backgroundImage:
              type === 'background' && background.length > 0 ? `url(${background})` : 's',
            backgroundSize: '500px 300px',
            backgroundRepeat: 'no-repeat',
            alignItems: type === 'background' && background.length > 0 ? 'center' : null,
            justifyContent: type === 'background' && background.length > 0 ? 'center' : null,
            display: type === 'background' && background.length > 0 ? 'flex' : null
          }}
        >
          {type !== 'image' ? (
            <Scrollbar continuousScrolling={false} alwaysShowTracks>
              <InputContent
                sx={{
                  color:
                    type === 'background' && background.length > 0 ? textColorBackground : '#000',
                  fontWeight: type === 'background' && background.length > 0 ? 'bold' : 'normal',
                  fontSize: type === 'background' && background.length > 0 ? '20px' : null
                }}
                autoFocus
                value={contentText}
                onChange={(e) => {
                  inputRef.current = e.target;
                  if (inputRef.current.offsetHeight > 172) {
                    setDisabled('');
                    setType('text');
                  }
                  setContentText(e.target.value);
                }}
                ref={inputRef}
                multiline
                placeholder={"What's on your mind"}
              />
            </Scrollbar>
          ) : (
            <Scrollbar alwaysShowTracks>
              <Box sx={{ display: 'block', maxHeight: '500px' }}>
                <InputBase
                  multiline
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder={"What's on your mind"}
                  fullWidth
                  sx={{
                    fontSize: '18px',
                    fontFamily: 'inherit'
                  }}
                />
                <Box>
                  <IconButton
                    onClick={deleteImagePost}
                    sx={{
                      position: 'absolute',
                      background: 'lightgrey',
                      right: '0px',
                      '&:hover': { backgroundColor: '#f5f7f6' }
                    }}
                  >
                    <Icon icon="eva:close-fill" />
                  </IconButton>
                  <ImagePost src={URL.createObjectURL(image)} />
                </Box>
              </Box>
            </Scrollbar>
          )}
        </Content>
        {type === 'background' ? (
          <>
            <Separate />
            <BoxBackground />
          </>
        ) : null}

        <Separate />
        <BoxOptions sx={{ border: `1px solid #000` }}>
          <Typography>Add to your post</Typography>
          <Box>
            <IconButton onClick={handleClickEmoji}>
              <Icon style={{ color: 'red' }} icon="carbon:face-add" />
            </IconButton>
            <Popover
              id="simple-popover"
              open={openEmoji}
              anchorEl={anchorElEmoji}
              onClose={handleCloseEmoji}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
            >
              <EmojiIconMessage choose={chooseEmoji} user={user} />
            </Popover>
            <IconButton onClick={chooseBackground} disabled={Boolean(disabled === 'background')}>
              <Icon
                style={{ color: disabled !== 'background' ? '#ebae34' : 'lightgrey' }}
                icon="foundation:background-color"
              />
            </IconButton>
            <IconButton onClick={chooseImage} disabled={Boolean(disabled === 'image')}>
              <Icon
                style={{ color: disabled !== 'image' ? '#30ab78' : 'lightgrey' }}
                icon="bx:bxs-image-add"
              />
            </IconButton>
            <IconButton
              sx={{ background: tags.length > 0 ? '#3713eb' : '#fff' }}
              onClick={() => dispatch(actionPostOpenTagPeople())}
            >
              <Icon
                style={{ color: '#07b8f2', width: '25px', height: '25px' }}
                icon="fa-solid:user-tag"
              />
            </IconButton>
          </Box>
        </BoxOptions>
        <ButtonPost
          onClick={savePost}
          sx={checkDisablePost() ? { background: 'lightgray', color: 'gray' } : null}
          disabled={checkDisablePost()}
        >
          Post
        </ButtonPost>
        <input
          onClick={(e) => {
            e.target.value = null;
          }}
          accept=".png, .jpg, .jpeg"
          onChange={(e) => onChangeFile(e.target.files)}
          ref={fileRef}
          style={{ display: 'none' }}
          type="file"
        />
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
          <Button
            onClick={() => {
              setStatus('public');
              handleClose();
            }}
            sx={{ background: '#fff', textTransform: 'none', fontSize: '18px', color: '#000' }}
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
            sx={{ background: '#fff', textTransform: 'none', fontSize: '18px', color: '#000' }}
            startIcon={<Icon icon="entypo:lock" />}
            endIcon={status === 'private' ? <Icon icon="ic:baseline-done" /> : null}
          >
            Only me
          </Button>
        </Popover>
      </BoxModal>
    </Modal>
  );
}

export default CreatePost;
