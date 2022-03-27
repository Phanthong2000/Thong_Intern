import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  styled,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../firebase-config';
import ModalInvite from './ModalInvite';
import { actionPageModalInvite } from '../../redux/actions/pageAction';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px'
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  background: '#fff'
}));
const BackgroundPage = styled('img')(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  borderRadius: '0px 0px 10px 10px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: '0px'
  }
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
  padding: '0px 20px',
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
  padding: '5px 50px'
}));
Page.prototype = {
  user: PropTypes.object
};
function Page({ user }) {
  const { id } = useParams();
  const [tab, setTab] = useState('posts');
  const [page, setPage] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalInvite = useSelector((state) => state.page.modalInvite);
  const getPage = (id) => {
    getDoc(doc(db, 'pages', id)).then((snapshot) => {
      console.log(snapshot.data().userCreate, user.id);
      if (snapshot.data().userCreate === user.id) navigate(`/home/pages/your-page/${id}`);
      setPage({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    if (user.id !== undefined) getPage(id);
    return () => null;
  }, [user]);
  const BoxMenu = () => {
    const menu = [
      {
        value: 'posts',
        label: 'Posts'
      },
      {
        value: 'about',
        label: 'About'
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {page.likes.includes(user.id) ? (
            <>
              <ButtonManage startIcon={<Icon icon="fontisto:like" />}>Liked</ButtonManage>{' '}
              <ButtonPromote
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
              </ButtonPromote>
            </>
          ) : (
            <ButtonManage startIcon={<Icon icon="fontisto:like" />}>Like</ButtonManage>
          )}
        </Box>
      </Box>
    );
  };
  if (page.id === undefined) return null;
  return (
    <RootStyle>
      <BoxInfo>
        <BackgroundPage src={page.background} />
        <BoxAvatar>
          <IconButton
            sx={{ marginTop: '-30px' }}
            disableTouchRipple
            disableFocusRipple
            disableRipple
          >
            <Avatar sx={{ width: '150px', height: '150px', zIndex: 2 }} src={page.avatar} />
            <IconButton
              sx={{ position: 'absolute', right: 10, bottom: 10, zIndex: 3, color: '#000' }}
            >
              <Icon icon="entypo:camera" />
            </IconButton>
          </IconButton>
          <Box sx={{ marginLeft: '10px', width: '100%' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '25px' }}>{page.name}</Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Typography sx={{ color: 'gray', fontSize: '20x' }}>{page.category}</Typography>
              {!page.followers.includes(user.id) ? (
                <ButtonPromote startIcon={<Icon icon="mdi:book-plus" />}>Follow</ButtonPromote>
              ) : (
                <ButtonPromote startIcon={<Icon icon="mdi:book-check" />}>Following</ButtonPromote>
              )}
            </Box>
          </Box>
        </BoxAvatar>
        <Divider sx={{ marginTop: '10px', width: '70%', marginLeft: '15%' }} />
        <BoxMenu />
      </BoxInfo>
      {modalInvite.status && <ModalInvite />}
    </RootStyle>
  );
}

export default Page;
