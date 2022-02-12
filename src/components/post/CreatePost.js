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
  Modal,
  Paper,
  Snackbar,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useDispatch } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

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
  margin: theme.spacing(2, 0, 2)
}));
const Content = styled(Box)(() => ({
  marginTop: '20px',
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
  padding: theme.spacing(1, 1, 1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const ImagePost = styled('img')(() => ({
  height: '500px',
  width: '100%'
}));
CreatePost.prototype = {
  user: PropTypes.object
};
function CreatePost({ user }) {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState('');
  const [openModal, setOpenModal] = useState(true);
  const [status, setStatus] = useState('public');
  const [type, setType] = useState('text');
  const [background, setBackground] = useState('');
  const [textColorBackground, setTextColorBackground] = useState('');
  const [allBackground, setAllBackground] = useState([]);
  const [image, setImage] = useState();
  useEffect(() => {
    const data = [];
    getDocs(collection(db, 'backgrounds'))
      .then((snapshots) => {
        snapshots.docs.forEach((snapshots) => {
          data.push({
            ...snapshots.data(),
            id: snapshots.id
          });
        });
      })
      .then(() => {
        setAllBackground(data);
      });
    return null;
  }, []);
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
        {allBackground.map((item, index) => {
          const onChooseBackground = () => {
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
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Create post</Typography>
          <IconButton
            onClick={() => console.log(inputRef)}
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
                onChange={(e) => {
                  inputRef.current = e.target;
                  if (inputRef.current.offsetHeight > 172) setType('text');
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
                  placeholder={"What's on your mind"}
                  fullWidth
                  sx={{
                    fontSize: '18px',
                    fontFamily: 'inherit'
                  }}
                />
                <ImagePost src={URL.createObjectURL(image)} />
              </Box>{' '}
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
            <IconButton>
              <Icon
                style={{ color: '#07b8f2', width: '25px', height: '25px' }}
                icon="fa-solid:user-tag"
              />
            </IconButton>
          </Box>
        </BoxOptions>
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
      </BoxModal>
    </Modal>
  );
}

export default CreatePost;
