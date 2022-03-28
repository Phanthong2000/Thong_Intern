import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Modal,
  styled,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../firebase-config';
import AvatarFriend from '../profile/AvatarFriend';
import BoxPost from './BoxPost';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import { actionUserBackdrop } from '../../redux/actions/userAction';
import { actionGetYourPages, actionPageModalInvite } from '../../redux/actions/pageAction';
import ModalCreatePost from './ModalCreatePost';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  background: '#fff'
}));
const WrapperBackground = styled(IconButton)(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: '0px'
  }
}));
const BackgroundPage = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '0px 0px 10px 10px',
  height: '350px'
}));
const BoxAvatar = styled(Box)(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  padding: '0px 10px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: '0px'
  }
}));
const ButtonManage = styled(Button)(({ theme }) => ({
  background: 'lightgrey',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#000',
  fontFamily: 'sans-serif',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    background: 'lightgrey'
  }
}));
const ButtonPromote = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#fff',
  background: theme.palette.green,
  textTransform: 'none',
  marginLeft: '10px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  marginRight: '10px',
  ':hover': {
    background: theme.palette.green
  },
  padding: '5px 10px'
}));
YourPage.prototype = {
  user: PropTypes.object
};
function YourPage({ user }) {
  const fileRef = useRef();
  const avatarRef = useRef();
  const { id } = useParams();
  const [background, setBackground] = useState('');
  const [imageBackground, setImageBackground] = useState({});
  const [choosing, setChoosing] = useState(false);
  const [tab, setTab] = useState('posts');
  const [page, setPage] = useState({});
  const [modalUpdateAvatar, setModalUpdateAvatar] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarNew, setAvatarNew] = useState('');
  const [imageAvatar, setImageAvatar] = useState({});
  const modalCreatePostPage = useSelector((state) => state.page.modalCreatePostPage);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getPage = (id) => {
    getDoc(doc(db, 'pages', id)).then((snapshot) => {
      if (snapshot.data().userCreate !== user.id) navigate(`/home/pages/${id}`);
      setPage({
        ...snapshot.data(),
        id: snapshot.id
      });
      setBackground(snapshot.data().background);
      setAvatar(snapshot.data().avatar);
    });
  };
  useEffect(() => {
    if (user.id !== undefined) getPage(id);
    return () => null;
  }, [user]);
  const chooseBackground = (e) => {
    e.stopPropagation();
    fileRef.current.click();
  };
  const onChangeFile = (files) => {
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setBackground(URL.createObjectURL(files[0]));
        setImageBackground(files[0]);
        setChoosing(true);
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Cover photo must less than 2MB',
            type: 'error'
          })
        );
        setChoosing(false);
      }
    }
  };
  const chooseAvatar = (e) => {
    e.stopPropagation();
    avatarRef.current.click();
  };
  const onChangeFileAvatar = (files) => {
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setAvatarNew(URL.createObjectURL(files[0]));
        setImageAvatar(files[0]);
        setModalUpdateAvatar(true);
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Avatar photo must less than 2MB',
            type: 'error'
          })
        );
      }
    }
  };
  const checkFollower = () => {
    if (page.followers.length < 2) return `${page.followers.length} follower`;
    return `${page.followers.length} followers`;
  };
  const cancelChange = () => {
    setChoosing(false);
    setBackground(page.background);
  };
  const saveChange = () => {
    const metadata = {
      contentType: 'image/*'
    };
    dispatch(
      actionUserBackdrop({
        status: true,
        content: 'Change cover photo page'
      })
    );
    const storageRef = ref(storage, `background/${user.id}.${new Date().getTime()}`);
    const uploadTask = uploadBytesResumable(storageRef, imageBackground, metadata);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        switch (snapshot.state) {
          case 'running':
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
          updateDoc(doc(db, 'pages', page.id), {
            background: downloadURL
          }).then(() => {
            setChoosing(false);
            dispatch(
              actionUserBackdrop({
                status: false,
                content: 'Change cover photo page'
              })
            );
            dispatch(
              actionOpenSnackbar({
                status: true,
                content: 'Changed cover photo page',
                type: 'success'
              })
            );
          });
        });
      }
    );
  };
  const GetBoxAvatarFriend = () => {
    if (page.followers.length <= 4) {
      const temp = page.followers.slice(0, page.followers.length);
      return (
        <Box sx={{ display: 'flex' }}>
          {temp.map((item, index) => (
            <AvatarFriend key={index} friend={{ friendId: item }} index={index} />
          ))}
        </Box>
      );
    }
    const temp = page.followers.slice(0, 3);
    return (
      <Box sx={{ display: 'flex' }}>
        {temp.map((item, index) => (
          <AvatarFriend key={index} friend={{ friendId: item }} index={index} />
        ))}
        <Icon
          style={{
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            marginLeft: '-10px',
            color: 'grey'
          }}
          icon="mdi:dots-horizontal-circle"
        />
      </Box>
    );
  };
  const BoxMenu = () => {
    const menu = [
      {
        value: 'posts',
        label: 'Posts'
      },
      {
        value: 'about',
        label: 'About'
      },
      {
        value: 'followers',
        label: 'Followers'
      }
    ];
    return (
      <Box
        sx={{
          width: '70%',
          marginLeft: '15%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
          {menu.map((item, index) => (
            <Tab
              value={item.value}
              key={index}
              label={item.value}
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          ))}
        </Tabs>
        <ButtonManage
          onClick={() => {
            dispatch(
              actionPageModalInvite({
                status: true,
                page
              })
            );
          }}
          startIcon={<Icon icon="akar-icons:plus" />}
        >
          Invite
        </ButtonManage>
      </Box>
    );
  };
  const ModalUpdateAvatar = () => {
    const BoxModal = styled(Card)(({ theme }) => ({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      background: '#fff',
      padding: theme.spacing(2, 2, 2),
      textAlign: 'center',
      display: 'block'
    }));
    const ModalUpdate = styled(Modal)(() => ({
      width: '100%',
      height: '100%'
    }));
    const NewAvatar = styled('img')(() => ({
      width: '300px',
      height: '300px'
    }));
    const ButtonCancel = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: theme.palette.green,
      fontFamily: 'inherit',
      fontSize: '18px',
      padding: theme.spacing(0.5, 2, 0.5)
    }));
    const ButtonSave = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      background: theme.palette.green,
      fontFamily: 'inherit',
      color: '#fff',
      fontSize: '18px',
      marginLeft: '20px',
      padding: theme.spacing(0.5, 2, 0.5),
      ':hover': {
        background: theme.palette.green
      }
    }));
    const saveChangeAvatar = () => {
      setModalUpdateAvatar(false);
      dispatch(
        actionUserBackdrop({
          status: true,
          content: 'Update avatar page'
        })
      );
      const metadata = {
        contentType: 'image/*'
      };
      const storageRef = ref(storage, `avatar/${user.id}.${new Date().getTime()}`);
      const uploadTask = uploadBytesResumable(storageRef, imageAvatar, metadata);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          switch (snapshot.state) {
            case 'running':
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
            updateDoc(doc(db, 'pages', page.id), {
              avatar: downloadURL
            }).then(() => {
              dispatch(actionGetYourPages(user.id));
              getPage(id);
              dispatch(
                actionUserBackdrop({
                  status: false,
                  content: 'Update avatar page'
                })
              );
              dispatch(
                actionOpenSnackbar({
                  status: true,
                  content: 'Changed avatar page',
                  type: 'success'
                })
              );
            });
          });
        }
      );
    };
    return (
      <ModalUpdate
        open={modalUpdateAvatar}
        onClose={() => setModalUpdateAvatar(true)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxModal>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
              Changes your avatar page
            </Typography>
            <IconButton
              onClick={() => setModalUpdateAvatar(false)}
              sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
            >
              <Icon icon="eva:close-fill" />
            </IconButton>
          </Box>
          <Divider sx={{ margin: '10px' }} />
          <NewAvatar src={avatarNew} alt="Avatar" />
          <Divider sx={{ margin: '10px' }} />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <ButtonCancel onClick={() => setModalUpdateAvatar(false)}>Cancel</ButtonCancel>
            <ButtonSave onClick={saveChangeAvatar}>Save changes</ButtonSave>
          </Box>
        </BoxModal>
      </ModalUpdate>
    );
  };
  if (page.id === undefined) return null;
  return (
    <RootStyle>
      <BoxInfo>
        <WrapperBackground
          disableTouchRipple
          disableRipple
          disableFocusRipple
          sx={{ width: '70%', marginLeft: '15%' }}
        >
          {choosing && (
            <Box
              sx={{
                width: '100%',
                height: '60px',
                background: '#000',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                top: 0,
                left: 0,
                padding: '0px 10px',
                opacity: 0.7
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  fontFamily: 'sans-serif'
                }}
              >
                Change cover photo page
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonManage onClick={cancelChange} sx={{ '&:hover': { background: '#fff' } }}>
                  Cancel
                </ButtonManage>
                <ButtonPromote onClick={saveChange}>Save change</ButtonPromote>
              </Box>
            </Box>
          )}
          <BackgroundPage src={background} />
          <Button
            onClick={chooseBackground}
            sx={{
              position: 'absolute',
              textTransform: 'none',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '14px',
              background: 'lightgrey',
              bottom: 20,
              right: 20,
              '&:hover': {
                background: 'lightgrey'
              }
            }}
            startIcon={<Icon icon="ci:edit" />}
          >
            Edit
          </Button>
        </WrapperBackground>
        <BoxAvatar>
          <IconButton
            sx={{ marginTop: '-30px' }}
            disableTouchRipple
            disableFocusRipple
            disableRipple
          >
            <Avatar sx={{ width: '150px', height: '150px', zIndex: 2 }} src={avatar} />
            <IconButton
              onClick={chooseAvatar}
              sx={{ position: 'absolute', right: 10, bottom: 10, zIndex: 3, color: '#000' }}
            >
              <Icon icon="entypo:camera" />
            </IconButton>
          </IconButton>
          <Box sx={{ marginLeft: '10px', width: '100%' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '25px' }}>{page.name}</Typography>
            <Typography sx={{ color: 'gray', fontSize: '20x' }}>{checkFollower()}</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <GetBoxAvatarFriend />
              <Box sx={{ display: 'flex' }}>
                <ButtonPromote startIcon={<Icon icon="gridicons:speaker" />}>Promote</ButtonPromote>
                <ButtonManage startIcon={<Icon icon="raphael:settingsalt" />}>Manage</ButtonManage>
              </Box>
            </Box>
          </Box>
        </BoxAvatar>
        <Divider sx={{ marginTop: '10px', width: '70%', marginLeft: '15%' }} />
        <BoxMenu />
      </BoxInfo>
      {tab === 'posts' && <BoxPost page={page} />}
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
      <input
        onClick={(e) => {
          e.target.value = null;
        }}
        accept=".png, .jpg, .jpeg"
        onChange={(e) => onChangeFileAvatar(e.target.files)}
        ref={avatarRef}
        style={{ display: 'none' }}
        type="file"
      />
      <ModalUpdateAvatar />
    </RootStyle>
  );
}

export default YourPage;
