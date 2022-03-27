import React, { useState } from 'react';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  ListItemButton,
  styled,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { addDoc, collection } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import categoryPage from '../../asset/data/categoryPage';
import { db } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import { actionUserBackdrop } from '../../redux/actions/userAction';
import { actionGetYourPages } from '../../redux/actions/pageAction';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px',
  display: 'flex',
  padding: '0px 10px'
}));
const BoxCreateGroup = styled(Card)(({ theme }) => ({
  width: '350px',
  background: '#fff',
  padding: '10px',
  minHeight: `${heightScreen - 60}px`,
  flexDirection: 'column',
  justifyContent: 'space-between',
  display: 'flex'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '20px',
  fontFamily: 'sans-serif'
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  marginTop: '20px'
}));
const ButtonCreate = styled(Button)(({ theme }) => ({
  width: '100%',
  color: '#fff',
  background: theme.palette.green,
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  fontFamily: 'sans-serif',
  ':hover': {
    background: theme.palette.green
  }
}));
const BoxPreview = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 350px)',
  minHeight: `${heightScreen - 60}px`,
  padding: '20px 10%'
}));
const BoxWrapperContent = styled(Card)(({ theme }) => ({
  width: '100%',
  background: '#fff',
  padding: theme.spacing(2),
  minHeight: '100%'
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxHeight: `${heightScreen - 160}px`,
  borderRadius: '10px',
  border: `1px solid lightgrey`,
  background: theme.palette.background,
  display: 'flex'
}));
const ImageCoverGroup = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  WebkitFilter: `grayscale(100%)`,
  filter: `grayscale(100%)`
}));
CreatePage.prototype = {
  user: PropTypes.object
};
function CreatePage({ user }) {
  const [pageName, setPageName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const create = () => {
    dispatch(
      actionUserBackdrop({
        status: true,
        content: `Create page`
      })
    );
    const page = {
      name: pageName,
      category: category.value,
      description,
      userCreate: user.id,
      likes: [user.id],
      followers: [user.id],
      avatar: 'https://www.facebook.com/images/pages/page_creation/page-default-cover-photo-4x.png',
      background:
        'https://www.facebook.com/images/pages/page_creation/page-default-cover-photo-4x.png'
    };
    addDoc(collection(db, 'pages'), page).then(() => {
      dispatch(actionGetYourPages(user.id));
      dispatch(
        actionUserBackdrop({
          status: false,
          content: `Create page`
        })
      );
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: `Create page success`,
          type: 'success'
        })
      );
      navigate('/home/pages');
    });
  };
  return (
    <RootStyle>
      <BoxCreateGroup elevation={3}>
        <Box>
          <Title>Create page</Title>
          <BoxInfo>
            <Avatar src={user.avatar} />
            <Box sx={{ marginLeft: '15px' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{user.username}</Typography>
            </Box>
          </BoxInfo>
          <TextField
            fullWidth
            inputProps={{ maxLength: 100 }}
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            sx={{ width: '100%', marginTop: '20px' }}
            id="outlined-basic"
            label="Page name"
            variant="outlined"
            helperText="Use the name of your business, brand or organization, or a name that explains what the Page is about."
          />
          <Box sx={{ background: '#fff' }}>
            <Autocomplete
              sx={{ marginTop: '10px' }}
              value={category}
              onChange={(event, newValue) => {
                setCategory(newValue);
              }}
              id="combo-box-demo"
              options={categoryPage}
              fullWidth
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Choose a category that describes what type of business, organization or topic the Page represents."
                  label="Category page"
                />
              )}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={5}
            inputProps={{ maxLength: 255 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: '100%', marginTop: '20px' }}
            id="outlined-basic"
            label="Description"
            variant="outlined"
            helperText="Write about what your business does, the services you provide, or the purpose of the Page."
          />
        </Box>
        <ButtonCreate onClick={create} disabled={Boolean(pageName === '' || category === '')}>
          Create
        </ButtonCreate>
      </BoxCreateGroup>
      <BoxPreview>
        <BoxWrapperContent>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Preview</Typography>
          <BoxContent>
            <Scrollbar alwaysShowTracks>
              <ImageCoverGroup src="https://www.facebook.com/images/pages/page_creation/page-default-cover-photo-4x.png" />
              <Box sx={{ padding: '0px 20px', background: '#fff', zIndex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: '100px',
                      height: '100px',
                      marginTop: '-20px',
                      outline: `3px solid #fff`,
                      border: `1px solid #000`,
                      zIndex: 2
                    }}
                    src="https://www.facebook.com/images/pages/page_creation/page-default-cover-photo-4x.png"
                  />
                  <Box sx={{ marginLeft: '20px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: '#000' }}>
                      {pageName === '' ? `Page name` : `${pageName}`}
                    </Typography>
                    <Typography sx={{ fontSize: '20px', color: 'gray' }}>
                      {category === '' ? `Category` : `${category.value}`}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ marginTop: '20px' }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'gray',
                      padding: '10px',
                      cursor: 'not-allowed'
                    }}
                  >
                    Home
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'gray',
                      padding: '10px',
                      cursor: 'not-allowed'
                    }}
                  >
                    About
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'gray',
                      padding: '10px',
                      cursor: 'not-allowed'
                    }}
                  >
                    More
                  </Typography>
                </Box>
              </Box>
              <Grid sx={{ padding: '10px' }} container>
                <Grid sx={{ padding: '10px' }} item xs={12} sm={12} md={12} lg={7} xl={7}>
                  <Card
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px',
                      background: '#fff'
                    }}
                  >
                    <Avatar
                      sx={{ outline: `1px solid gray` }}
                      src="https://www.facebook.com/images/pages/page_creation/page-default-cover-photo-4x.png"
                    />
                    <Box
                      sx={{
                        background: 'lightgrey',
                        borderRadius: '30px',
                        width: '100%',
                        marginLeft: '10px',
                        textAlign: 'center',
                        padding: '5px 0px',
                        cursor: 'not-allowed'
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>
                        Create post
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid sx={{ padding: '10px 0px' }} item xs={12} sm={12} md={12} lg={5} xl={5}>
                  <Card
                    sx={{
                      padding: '10px',
                      background: '#fff'
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>About</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon icon="mdi:alpha-i-circle" />
                      <Typography sx={{ marginLeft: '10px' }}>
                        {description === '' ? `Description` : `${description}`}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Scrollbar>
          </BoxContent>
        </BoxWrapperContent>
      </BoxPreview>
    </RootStyle>
  );
}

export default CreatePage;
