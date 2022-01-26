import React from 'react';
import { Logout } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
  styled,
  Typography
} from '@mui/material';

const BootStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '10px',
  background: '#fff',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  width: '400px',
  top: '60px',
  color: '#000'
}));
const InfoItem = styled(Stack)(({ theme }) => ({
  color: '#000',
  marginLeft: '20px'
}));
const Separate = styled(Divider)(({ theme }) => ({
  width: '90%',
  marginLeft: '5%',
  marginTop: '10px',
  marginBottom: '10px'
}));
const NameItem = styled(Typography)(({ theme }) => ({
  marginLeft: '10',
  fontSize: '18px'
}));
function BoxProfile() {
  return (
    <BootStyle sx={{ boxShadow: 3 }}>
      <List>
        <ListItemButton>
          <Avatar src="https://i-giaitri.vnecdn.net/2021/03/14/Avatar-1615695904-2089-1615696022_680x0.jpg" />
          <InfoItem>
            <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Phan Thong</Typography>
            <Typography>See your profile</Typography>
          </InfoItem>
        </ListItemButton>
        <Separate />
        <ListItemButton>
          <Logout />
          <NameItem>Log Out</NameItem>
        </ListItemButton>
      </List>
    </BootStyle>
  );
}

export default BoxProfile;
