import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
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
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { db } from '../../firebase-config';
import AvatarFriend from '../profile/AvatarFriend';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`
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
  const { id } = useParams();
  const [tab, setTab] = useState('posts');
  const [page, setPage] = useState({});
  const navigate = useNavigate();
  const getPage = (id) => {
    getDoc(doc(db, 'pages', id)).then((snapshot) => {
      console.log(snapshot.data().userCreate, user.id);
      if (snapshot.data().userCreate !== user.id) navigate(`/home/pages/${id}`);
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
  const checkFollower = () => {
    if (page.followers.length < 2) return `${page.followers.length} follower`;
    return `${page.followers.length} followers`;
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
      <Box sx={{ width: '70%', marginLeft: '15%' }}>
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
    </RootStyle>
  );
}

export default YourPage;
