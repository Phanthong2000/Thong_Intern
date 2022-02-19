import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  IconButton,
  Button,
  styled,
  Snackbar,
  Alert,
  Typography,
  Skeleton
} from '@mui/material';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { storage, db } from '../../firebase-config';
import {
  actionUserCloseLoadingUpdateProfile,
  actionUserOpenLoadingUpdateProfile
} from '../../redux/actions/userAction';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const RootStyle = styled(Card)(({ theme }) => ({
  background: '#fff',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  height: '400px'
}));
const CoverImage = styled('img')(({ theme }) => ({
  width: '80%',
  height: '400px',
  borderRadius: theme.spacing(0, 0, 2, 2),
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const CoverButton = styled(IconButton)(() => ({
  position: 'absolute',
  background: '#fff',
  zIndex: 2
}));
const SkeletonCover = styled(Skeleton)(({ theme }) => ({
  width: '80%',
  height: '400px',
  borderRadius: theme.spacing(0, 0, 2, 2),
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
InfoMain.prototype = {
  user: PropTypes.object
};
function InfoMain({ user }) {
  const fileRef = useRef(null);
  const isLoadingUpdateProfile = useSelector((state) => state.user.isLoadingUpdateProfile);
  const dispatch = useDispatch();
  const [background, setBackground] = useState('');
  const [showEditCover, setShowEditCover] = useState('flex');
  const [image, setImage] = useState();
  const [choosing, setChoosing] = useState(false);
  useEffect(() => {
    setBackground(user.background);
    return () => null;
  }, [user]);
  const chooseBackground = () => {
    fileRef.current.click();
  };
  const onChangeFile = (files) => {
    console.log(files);
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setBackground(URL.createObjectURL(files[0]));
        setImage(files[0]);
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
  const ChangeBackgroundBar = () => {
    const RootStyle = styled(Box)(({ theme }) => ({
      width: `calc(100% - 80px)`,
      position: 'absolute',
      background: '#000',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: 0.5,
      [theme.breakpoints.down('md')]: {
        width: '100%'
      }
    }));
    const ButtonCancel = styled(Button)(({ theme }) => ({
      background: 'gray',
      color: '#fff',
      textTransform: 'none',
      fontSize: '16px',
      padding: theme.spacing(0.5, 4, 0.5),
      ':hover': {
        background: '#7a6867'
      }
    }));
    const ButtonSave = styled(Button)(({ theme }) => ({
      background: '#61a65b',
      color: '#fff',
      textTransform: 'none',
      fontSize: '16px',
      marginLeft: '5px',
      padding: theme.spacing(0.5, 2, 0.5),
      ':hover': {
        background: theme.palette.green
      }
    }));
    const cancelChangeBackground = () => {
      setBackground(user.background);
      setShowEditCover('flex');
      setChoosing(false);
    };
    const saveChangeBackground = () => {
      const metadata = {
        contentType: 'image/*'
      };
      const storageRef = ref(storage, `background/${user.id}.${new Date().getTime()}`);
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
              background: downloadURL
            }).then(() => {
              setChoosing(false);
              dispatch(actionUserCloseLoadingUpdateProfile());
              dispatch(
                actionOpenSnackbar({
                  status: true,
                  content: 'Changed your cover photo',
                  type: 'success'
                })
              );
            });
          });
        }
      );
    };
    return (
      <RootStyle>
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
          <Icon
            icon="ic:round-change-circle"
            style={{ color: '#fff', width: '40px', height: '40px' }}
          />
          <Typography sx={{ color: '#fff', fontSize: '18px', marginLeft: '5px' }}>
            Changes your cover photo
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
          <ButtonCancel onClick={cancelChangeBackground}>Cancel</ButtonCancel>
          <ButtonSave onClick={saveChangeBackground}>Save changes</ButtonSave>
        </Box>
      </RootStyle>
    );
  };
  return (
    <RootStyle>
      {!choosing ? null : <ChangeBackgroundBar />}
      {user.id === undefined ? (
        <SkeletonCover variant="rectangular" />
      ) : (
        <CoverImage
          onMouseLeave={() => setShowEditCover('none')}
          onMouseEnter={() => setShowEditCover('flex')}
          on
          src={background}
        />
      )}
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
      {!choosing ? (
        <CoverButton
          onMouseLeave={() => setShowEditCover('none')}
          onMouseEnter={() => setShowEditCover('flex')}
          onClick={() => chooseBackground()}
          sx={{ display: showEditCover }}
        >
          <Icon icon="ic:baseline-photo-camera" style={{ color: '#000' }} />
        </CoverButton>
      ) : null}
    </RootStyle>
  );
}

export default InfoMain;
