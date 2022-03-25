import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  styled,
  Typography
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Scrollbar } from 'smooth-scrollbar-react';
import feedConfig from './feedConfig';
import GroupItem from './GroupItem';
import OptionFeed from './OptionFeed';

const heightScreen = window.innerHeight - 1;
const widthScreen = window.innerWidth;
const RootStyle = styled(Box)(({ theme }) => ({
  minWidth: `${widthScreen}px`,
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px',
  display: 'flex',
  overflowX: 'auto',
  padding: '0px 10px'
}));
const BoxLeft = styled(Card)(({ theme }) => ({
  width: '400px',
  minHeight: `${heightScreen - 60}px`,
  maxHeight: `${heightScreen - 60}px`,
  display: 'flex',
  background: '#fff',
  padding: '10px'
}));
const BoxTitle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  display: 'flex',
  alignItems: 'center',
  padding: '2px 10px',
  borderRadius: '30px'
}));
const ButtonCreateGroup = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: '10px',
  textTransform: 'capitalize',
  background: '#eafae6',
  color: theme.palette.green,
  fontFamily: 'sans-serif',
  padding: '7px 0px'
}));
const BoxRight = styled(Box)(({ theme }) => ({
  width: `${widthScreen - 350}px`
}));
function Feed({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const groupsYouManage = useSelector((state) => state.group.groupsYouManage);
  const groupsYouJoined = useSelector((state) => state.group.groupsYouJoined);
  const goToCreateGroup = () => {
    navigate('/home/groups/create-group');
  };
  return (
    <RootStyle>
      <BoxLeft>
        <Scrollbar alwaysShowTracks>
          <BoxTitle>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'sans-serif' }}>
              Groups
            </Typography>
            <IconButton>
              <Icon icon="ant-design:setting-filled" />
            </IconButton>
          </BoxTitle>
          <BoxSearch>
            <Icon style={{ width: '20px', height: '20px' }} icon="fluent:search-20-filled" />
            <InputBase placeholder="Search groups" sx={{ marginLeft: '10px' }} fullWidth />
          </BoxSearch>
          <Divider sx={{ marginTop: '10px' }} />
          <Box sx={{ width: '100%' }}>
            {feedConfig.map((item, index) => (
              <OptionFeed option={item} key={index} />
            ))}
            <ButtonCreateGroup onClick={goToCreateGroup}>
              <Icon style={{ width: '20px', height: '20px' }} icon="dashicons:plus-alt2" />
              <Typography sx={{ fontWeight: 'bold', fontSie: '16px', marginLeft: '10px' }}>
                Create New Group
              </Typography>
            </ButtonCreateGroup>
          </Box>
          <Divider sx={{ marginTop: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <Typography
              sx={{ fontFamily: 'sans-serif', fontWeight: 'bolder', marginBottom: '10px' }}
            >
              Groups you manage
            </Typography>
            {groupsYouManage.map((item, index) => (
              <GroupItem group={item} key={index} />
            ))}
          </Box>
          <Box sx={{ marginTop: '10px' }}>
            <Typography
              sx={{ fontFamily: 'sans-serif', fontWeight: 'bolder', marginBottom: '10px' }}
            >
              Groups you've joined
            </Typography>
            {groupsYouJoined.map((item, index) => (
              <GroupItem group={item} key={index} />
            ))}
          </Box>
        </Scrollbar>
      </BoxLeft>
      <BoxRight>
        <Outlet />
      </BoxRight>
    </RootStyle>
  );
}

export default Feed;
