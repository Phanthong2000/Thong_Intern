import {
  Box,
  Card,
  Divider,
  IconButton,
  Badge,
  ListItemButton,
  styled,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { getDocs, query } from 'firebase/firestore';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Card)(({ theme }) => ({
  width: '350px',
  minHeight: `${heightScreen - 60}px`,
  background: '#fff',
  boxShadow: 3,
  padding: '10px'
}));
const BoxTitle = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
BoxAdmin.prototype = {
  user: PropTypes.object,
  group: PropTypes.object,
  hidden: PropTypes.func,
  option: PropTypes.string,
  home: PropTypes.func,
  overview: PropTypes.func,
  requests: PropTypes.func
};
function BoxAdmin({ user, group, hidden, option, home, overview, requests }) {
  const BoxGroup = () => {
    const Group = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      margin: '10px 0px',
      alignItems: 'center'
    }));
    const AvatarGroup = styled('img')(({ theme }) => ({
      width: '50px',
      height: '50px',
      borderRadius: `5px`
    }));
    return (
      <Group>
        <AvatarGroup src={group.avatar} />
        <Box sx={{ marginLeft: '10px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'sans-serif' }}>
            {group.name}
          </Typography>
          {group.status === 'public' ? (
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '12px',
                color: 'gray',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Icon icon="carbon:earth-filled" />
              <Typography sx={{ marginLeft: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                Public group
              </Typography>
            </Typography>
          ) : (
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '12px',
                color: 'gray',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Icon icon="carbon:earth-filled" />
              <Typography sx={{ marginLeft: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                Private group
              </Typography>
            </Typography>
          )}
        </Box>
      </Group>
    );
  };
  return (
    <RootStyle>
      <BoxTitle>
        <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'sans-serif' }}>
          Manage group
        </Typography>
        <IconButton onClick={hidden}>
          <Icon icon="fluent:panel-left-contract-16-filled" />
        </IconButton>
      </BoxTitle>
      <BoxGroup />
      <Divider sx={{ margin: '10px 0px' }} />
      <ListItemButton
        onClick={home}
        sx={{
          alignItems: 'center',
          display: 'center',
          background: option === 'home' && 'lightgrey'
        }}
      >
        <Icon style={{ width: '25px', height: '25px' }} icon="dashicons:admin-home" />
        <Typography
          sx={{
            marginLeft: '10px',
            fontWeight: 'bold',
            fontSize: '15px',
            fontFamily: 'sans-serif'
          }}
        >
          Home
        </Typography>
      </ListItemButton>
      <ListItemButton
        onClick={overview}
        sx={{
          alignItems: 'center',
          display: 'center',
          background: option === 'overview' && 'lightgrey'
        }}
      >
        <Icon style={{ width: '25px', height: '25px' }} icon="clarity:grid-view-solid" />
        <Typography
          sx={{
            marginLeft: '10px',
            fontWeight: 'bold',
            fontSize: '15px',
            fontFamily: 'sans-serif'
          }}
        >
          Overview
        </Typography>
      </ListItemButton>
      <Divider sx={{ margin: '10px 0px' }} />
      <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
        Admin tools
      </Typography>
      <ListItemButton
        onClick={requests}
        sx={{
          alignItems: 'center',
          display: 'center',
          justifyContent: 'space-between',
          background: option === 'requests' && 'lightgrey',
          marginTop: '20px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon style={{ width: '25px', height: '25px' }} icon="ri:user-shared-fill" />
          <Typography
            sx={{
              marginLeft: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              fontFamily: 'sans-serif'
            }}
          >
            Member requests
          </Typography>
        </Box>
        <Badge variant="standard" color="success" badgeContent={group.requests.length} />
      </ListItemButton>
    </RootStyle>
  );
}

export default BoxAdmin;
