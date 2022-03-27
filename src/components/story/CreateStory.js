import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  Divider,
  styled,
  TextField,
  Typography,
  Grid,
  Button,
  Skeleton
} from '@mui/material';
import { Icon } from '@iconify/react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import backgroundStory from '../../asset/data/backgroundStory';
import { db } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import { actionGetStoryUser } from '../../redux/actions/userAction';
import Snack from '../Snack';

const heightScreen = window.innerHeight;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '60px',
  height: `${heightScreen - 61}px`,
  background: theme.palette.background,
  display: 'flex',
  padding: '20px',
  [theme.breakpoints.down('md')]: {
    padding: '20px 20px 20px 0px'
  }
}));
const CreateStorySidebar = styled(Box)(() => ({
  width: '400px',
  height: '100%',
  background: '#fff',
  padding: '10px'
}));
const BoxContent = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  textAlign: 'center'
}));
const ButtonTypePhoto = styled(Box)(() => ({
  width: '220px',
  height: '330px',
  borderRadius: '20px',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '220px 330px',
  display: 'flex',
  marginRight: '20px',
  cursor: 'pointer',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/55349832_403803457088017_170167072418955264_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=tchacAqgyp4AX8oGmKD&tn=ca8LXF0NWlMZLzjN&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT8JUtiKPLKrdeYgs3ZWbLpZev4LXwjaT-8XEHNFefJnkQ&oe=621ED0AE)`
}));
const ButtonTypeText = styled(Box)(() => ({
  width: '220px',
  height: '330px',
  borderRadius: '20px',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '220px 330px',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  alignItems: 'center',
  backgroundImage: `url(https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/58262940_285817512345690_8722691640277336064_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=AWUjOHVcFDYAX8GKy-B&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-TtVwf5I0_iTx8aDIKKmeD3YVa7DgNV3MeR_NfGnkq0A&oe=6238110B)`
}));
function CreateStory() {
  const user = useSelector((state) => state.user.user);
  const fileRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState('');
  const [backgroundText, setBackgroundText] = useState(
    'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/58262940_285817512345690_8722691640277336064_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=4mUay9b2l7AAX_wWXQP&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_ClN_6RxAn47_58KyFqpRJCzPtFZ0eFRzR6OpBeB376A&oe=621E5BCB'
  );
  const [textColor, setTextColor] = useState('white');
  const [content, setContent] = useState('');
  const [image, setImage] = useState();
  useEffect(() => {
    document.title = 'Create Stories | Thong Intern';
    return () => null;
  }, [user]);
  const inputContent = (text) => {
    setContent(text);
  };
  const onChangeFile = (files) => {
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setType('image');
        setImage(files[0]);
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Story photo must less than 2MB',
            type: 'error'
          })
        );
      }
    }
  };
  const BoxEditStoryText = () => {
    const BoxEditText = styled(Box)(() => ({
      padding: '10px'
    }));
    const ButtonDiscard = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#000',
      background: theme.palette.background,
      fontWeight: 'bold',
      fontSize: '16px',
      marginRight: '20px'
    }));
    const ButtonShare = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#fff',
      background: theme.palette.green,
      fontWeight: 'bold',
      fontSize: '16px',
      marginRight: '20px',
      ':hover': {
        background: theme.palette.green
      }
    }));
    const shareToStory = () => {
      const story = {
        userId: user.id,
        type,
        content,
        contentFile: backgroundText,
        createdAt: new Date().getTime(),
        watches: [],
        textColor
      };
      addDoc(collection(db, 'stories'), story).then(() => {
        dispatch(actionGetStoryUser(user.id));
        navigate('/home/app');
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Shared your story',
            type: 'success'
          })
        );
      });
    };
    return (
      <BoxEditText>
        <Grid container sx={{ marginTop: '10px', width: '100%' }}>
          {backgroundStory.map((item, index) => (
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                alignItems: 'center',
                marginTop: '5px'
              }}
              xs={2}
              sm={2}
              md={2}
              lg={2}
              xl={2}
              key={index}
            >
              <Avatar
                onClick={() => {
                  setTextColor(item.textColor);
                  setBackgroundText(item.contentFile);
                }}
                sx={{
                  border: backgroundText === item.contentFile && `5px solid #30ab78`,
                  cursor: 'pointer'
                }}
                src={item.contentFile}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ width: '100%', marginTop: '20px', justifyContent: 'end', display: 'flex' }}>
          <ButtonDiscard>Discard</ButtonDiscard>
          <ButtonShare onClick={shareToStory}>Share to story</ButtonShare>
        </Box>
      </BoxEditText>
    );
  };
  const BoxPreview = () => {
    const Preview = styled(Card)(() => ({
      width: '80%',
      height: '100%',
      padding: '20px'
    }));
    return (
      <Preview>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Preview</Typography>
        <Box
          sx={{
            borderRadius: '20px',
            background: '#434544',
            width: '100%',
            height: '100%',
            padding: '20px 0px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              borderRadius: '20px',
              backgroundImage: `url(${backgroundText})`,
              width: '320px',
              minHeight: '570px',
              maxHeight: '570px',
              backgroundSize: '320px 570px',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflow: 'auto'
            }}
          >
            <Typography
              sx={{
                maxHeight: '570px',
                fontWeight: 'bold',
                color: textColor,
                fontSize: '18px'
              }}
            >
              {content === '' ? 'START TYPING' : content}
            </Typography>
          </Box>
        </Box>
      </Preview>
    );
  };
  const BoxPreviewImage = () => {
    const Preview = styled(Card)(() => ({
      width: '80%',
      height: '100%',
      padding: '20px'
    }));
    return (
      <Preview>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Preview</Typography>
        <Box
          sx={{
            borderRadius: '20px',
            background: '#434544',
            width: '100%',
            height: '100%',
            padding: '20px 0px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              borderRadius: '20px',
              backgroundImage: `url(${URL.createObjectURL(image)})`,
              width: '320px',
              minHeight: '570px',
              maxHeight: '570px',
              backgroundSize: '320px 570px',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflow: 'auto'
            }}
          >
            <Typography
              sx={{
                maxHeight: '570px',
                fontWeight: 'bold',
                color: textColor,
                fontSize: '18px'
              }}
            >
              {content === '' ? 'START TYPING' : content}
            </Typography>
          </Box>
        </Box>
      </Preview>
    );
  };
  return (
    <RootStyle>
      <CreateStorySidebar>
        <Typography sx={{ fontWeight: 'bold', fontSize: '25px', fontFamily: 'inherit' }}>
          Your story
        </Typography>
        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {user.avatar === undefined ? (
            <>
              <Skeleton variant="circular" sx={{ width: '60px', height: '60px' }} />
              <Skeleton
                variant="text"
                sx={{ width: '150px', height: '24px', marginLeft: '10px' }}
              />
            </>
          ) : (
            <>
              <Avatar sx={{ width: '60px', height: '60px' }} src={user.avatar} />
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif', marginLeft: '10px' }}>
                {user.username}
              </Typography>
            </>
          )}
        </Box>
        <Divider sx={{ marginTop: '20px' }} />
        {type === 'text' && (
          <>
            <TextField
              id="filled-textarea"
              label="Text"
              placeholder="Start typing"
              multiline
              fullWidth
              autoFocus
              minRows={6}
              maxRows={6}
              value={content}
              onChange={(e) => inputContent(e.target.value)}
              variant="filled"
            />
            <BoxEditStoryText />
          </>
        )}
      </CreateStorySidebar>
      {type === '' && (
        <BoxContent>
          <ButtonTypePhoto onClick={() => fileRef.current.click()}>
            <Box sx={{ textAlign: 'center' }}>
              <Icon style={{ color: '#fff', width: '30px', height: '30px' }} icon="ion:images" />
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>
                Create a photo story
              </Typography>
            </Box>
          </ButtonTypePhoto>
          <ButtonTypeText onClick={() => setType('text')}>
            <Box sx={{ textAlign: 'center' }}>
              <Icon
                style={{ color: '#fff', width: '30px', height: '30px' }}
                icon="cryptocurrency:aave"
              />
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>
                Create a text story
              </Typography>
            </Box>
          </ButtonTypeText>
        </BoxContent>
      )}
      {type === 'text' && (
        <BoxContent>
          <BoxPreview />
        </BoxContent>
      )}
      {type === 'image' && (
        <BoxContent>
          <BoxPreviewImage />
        </BoxContent>
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
      <Snack />
    </RootStyle>
  );
}

export default CreateStory;
