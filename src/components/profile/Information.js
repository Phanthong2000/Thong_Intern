import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Stack,
  styled,
  Typography,
  Button,
  Modal,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { collection, getDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { storage, db } from '../../firebase-config';
import {
  actionUserCloseLoadingUpdateProfile,
  actionUserOpenLoadingUpdateProfile
} from '../../redux/actions/userAction';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '60%',
  marginTop: '10px',
  background: '#fff',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center'
  }
}));
const WrapperInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const AvatarUser = styled(IconButton)(() => ({
  width: '20%'
}));
const AvatarImage = styled(Avatar)(() => ({
  width: '100px',
  height: '100px',
  border: '2px solid #30ab78',
  cursor: 'pointer'
}));
const AvatarButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  bottom: '5px',
  right: '5px',
  background: theme.palette.background
}));
const InfoUser = styled(Stack)(({ theme }) => ({
  width: '78%',
  marginLeft: '2%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '0px'
  }
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '22px',
  fontFamily: 'sans-serif'
}));
const TotalFriend = styled(Typography)(() => ({
  color: 'grey',
  fontSize: '18px',
  fontFamily: 'sans-serif'
}));
const WrapperEditProfile = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const BoxAvatarFriends = styled(Box)(({ theme }) => ({
  width: '55%',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const BoxButtonEditProfile = styled(Box)(({ theme }) => ({
  width: '45%',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const ButtonEditProfile = styled(Button)(({ theme }) => ({
  color: theme.palette.green,
  textDecoration: 'none',
  background: theme.palette.background,
  textTransform: 'none',
  fontSize: '18px',
  fontWeight: 'bold'
}));
Information.prototype = {
  user: PropTypes.object
};
function Information({ user }) {
  const fileRef = useRef(null);
  const { id } = useParams();
  const [friends1, setFriends1] = useState([]);
  const [friends2, setFriends2] = useState([]);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDiscardChange, setOpenModalDiscardChange] = useState(false);
  const [avatarNew, setAvatarNew] = useState('');
  const [image, setImage] = useState();
  const [avatar, setAvatar] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    getFriendWhenUserIsReceiver();
    getFriendWhenUserIsSender();
    setAvatar(user.avatar);
    return null;
  }, [user]);
  const getFriendWhenUserIsReceiver = () => {
    const data = [];
    getDocs(
      query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
    ).then((snapshots) => {
      snapshots.docs.forEach((contact) => {
        getDoc(doc(db, 'users', contact.data().senderId)).then((snapshot) => {
          data.push({
            ...snapshot.data(),
            id: snapshot.id
          });
          if (snapshots.docs.length === data.length) {
            setFriends1(data);
          }
        });
      });
    });
  };
  const getFriendWhenUserIsSender = () => {
    const data = [];
    getDocs(
      query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
    ).then((snapshots) => {
      snapshots.docs.forEach((contact) => {
        getDoc(doc(db, 'users', contact.data().receiverId)).then((snapshot) => {
          data.push({
            ...snapshot.data(),
            id: snapshot.id
          });
          if (snapshots.docs.length === data.length) {
            setFriends2(data);
          }
        });
      });
    });
  };
  const getTotalFriends = () => {
    const data = [...friends1, ...friends2];
    if (data.length < 2) return `${data.length} Friend`;
    return `${data.length} Friends`;
  };
  const onChangeFile = (files) => {
    console.log(files);
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setAvatarNew(URL.createObjectURL(files[0]));
        setImage(files[0]);
        setOpenModalUpdate(true);
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Profile picture photo must less than 2MB',
            type: 'error'
          })
        );
        setOpenModalUpdate(false);
      }
    }
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
      setOpenModalUpdate(false);
      const metadata = {
        contentType: 'image/*'
      };
      const storageRef = ref(storage, `avatar/${user.id}.${new Date().getTime()}`);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          switch (snapshot.state) {
            case 'running':
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
            console.log('File available at', downloadURL);
            updateDoc(doc(db, 'users', user.id), {
              avatar: downloadURL
            }).then(() => {
              dispatch(actionUserCloseLoadingUpdateProfile());
              dispatch(
                actionOpenSnackbar({
                  status: true,
                  content: 'Changed your profile picture',
                  type: 'success'
                })
              );
              setAvatar(avatarNew);
            });
          });
        }
      );
    };
    return (
      <ModalUpdate
        open={openModalUpdate}
        onClose={() => setOpenModalDiscardChange(true)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxModal>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
              Changes your profile picture
            </Typography>
            <IconButton
              onClick={() => setOpenModalDiscardChange(true)}
              sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
            >
              <Icon icon="eva:close-fill" />
            </IconButton>
          </Box>
          <Divider sx={{ margin: '10px' }} />
          <NewAvatar src={avatarNew} alt="Avatar" />
          <Divider sx={{ margin: '10px' }} />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <ButtonCancel onClick={() => setOpenModalDiscardChange(true)}>Cancel</ButtonCancel>
            <ButtonSave onClick={saveChangeAvatar}>Save changes</ButtonSave>
          </Box>
        </BoxModal>
      </ModalUpdate>
    );
  };
  const ModalDiscardChange = () => {
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
    const ButtonCancel = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: theme.palette.green,
      fontFamily: 'inherit',
      fontSize: '18px',
      padding: theme.spacing(0.5, 2, 0.5)
    }));
    const ButtonDiscard = styled(Button)(({ theme }) => ({
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
    return (
      <Modal
        open={openModalDiscardChange}
        onClose={() => {
          setOpenModalDiscardChange(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxModal>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Discard changes</Typography>
            <IconButton
              onClick={() => {
                setOpenModalDiscardChange(false);
              }}
              sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
            >
              <Icon icon="eva:close-fill" />
            </IconButton>
          </Box>
          <Divider sx={{ margin: '10px' }} />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <ButtonCancel
              onClick={() => {
                setOpenModalDiscardChange(false);
              }}
            >
              Cancel
            </ButtonCancel>
            <ButtonDiscard
              onClick={() => {
                setOpenModalDiscardChange(false);
                setOpenModalUpdate(false);
              }}
            >
              Discard
            </ButtonDiscard>
          </Box>
        </BoxModal>
      </Modal>
    );
  };
  return (
    <RootStyle>
      <WrapperInfo>
        <AvatarUser sx={{ '&:hover': { backgroundColor: 'transparent' } }} aria-label="Delete">
          <AvatarImage onClick={() => console.log('avatar')} src={avatar} />
          <AvatarButton
            onClick={() => {
              fileRef.current.click();
            }}
          >
            <Icon
              icon="ic:baseline-photo-camera"
              style={{ color: '#000', width: '20px', height: '20px' }}
            />
          </AvatarButton>
        </AvatarUser>
        <InfoUser>
          <Username>{user.username}</Username>
          <TotalFriend>{getTotalFriends()}</TotalFriend>
          <WrapperEditProfile>
            <BoxAvatarFriends>
              <Typography>BoxAvatarFriends</Typography>
            </BoxAvatarFriends>
            <BoxButtonEditProfile>
              <ButtonEditProfile startIcon={<Icon icon="entypo:edit" />}>
                Edit profile
              </ButtonEditProfile>
            </BoxButtonEditProfile>
          </WrapperEditProfile>
        </InfoUser>
      </WrapperInfo>
      <ModalUpdateAvatar />
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
      <ModalDiscardChange />
    </RootStyle>
  );
}

export default Information;
