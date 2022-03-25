import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  List,
  ListItemButton,
  MenuItem,
  styled,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px',
  display: 'flex'
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
CreateGroup.prototype = {
  user: PropTypes.object
};
function CreateGroup({ user }) {
  const [groupName, setGroupName] = useState('');
  const [status, setStatus] = useState('Public');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const statuses = [
    {
      value: 'Public',
      label: <Icon icon="carbon:earth-filled" />
    },
    {
      value: 'Private',
      label: <Icon icon="dashicons:lock" />
    }
  ];
  const createGroup = () => {
    const group = {
      name: groupName,
      status: status.toLowerCase(),
      createdAt: new Date().getTime(),
      userCreate: user.id,
      members: [user.id],
      avatar: `https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png`,
      requests: []
    };
    addDoc(collection(db, 'groups'), group).then((docRef) => {
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Create group success',
          type: 'success'
        })
      );
      navigate(`/home/groups/${docRef.id}`);
    });
  };
  return (
    <RootStyle>
      <BoxCreateGroup elevation={3}>
        <Box>
          <Title>Create group</Title>
          <BoxInfo>
            <Avatar src={user.avatar} />
            <Box sx={{ marginLeft: '15px' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{user.username}</Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>
                Admin
              </Typography>
            </Box>
          </BoxInfo>
          <TextField
            fullWidth
            inputProps={{ maxLength: 100 }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ width: '100%', marginTop: '20px' }}
            id="outlined-basic"
            label="Group name"
            variant="outlined"
          />
          <TextField
            label="Choose privacy"
            sx={{ width: '100%', marginTop: '20px', display: 'flex', background: '#fff' }}
            fullWidth
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((option, index) => (
              <ListItemButton sx={{ background: '#fff' }} key={index} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {option.label}
                  <Typography sx={{ fontWeight: 'bold', marginLeft: '10px' }}>
                    {option.value}
                  </Typography>
                </Box>
              </ListItemButton>
            ))}
          </TextField>
        </Box>
        <ButtonCreate onClick={createGroup} disabled={Boolean(groupName === '')}>
          Create
        </ButtonCreate>
      </BoxCreateGroup>
      <BoxPreview>
        <BoxWrapperContent>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Preview</Typography>
          <BoxContent>
            <Scrollbar alwaysShowTracks>
              <ImageCoverGroup src="https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png" />
              <Box sx={{ padding: '20px', background: '#fff' }}>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '25px',
                    fontFamily: 'sans-serif',
                    color: 'gray'
                  }}
                >
                  {groupName === '' ? `Group name` : `${groupName}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {status === 'Public' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                      <Icon icon="carbon:earth-filled" />
                      <Typography sx={{ marginLeft: '5px' }}>Public group</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                      <Icon icon="dashicons:lock" />
                      <Typography sx={{ marginLeft: '5px' }}>Private group</Typography>
                    </Box>
                  )}
                  <Icon icon="ci:dot-01-xs" />
                  <Typography
                    sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px', color: 'gray' }}
                  >
                    1 member
                  </Typography>
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
                    Discussion
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
                    People
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
                    <Avatar sx={{ outline: `1px solid gray` }} src={user.avatar} />
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
                        What's on your mind?
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
                    {status === 'Public' ? (
                      <Box sx={{ marginTop: '10px', display: 'flex' }}>
                        <Icon
                          style={{ width: '30px', height: '30px' }}
                          icon="carbon:earth-filled"
                        />
                        <Box sx={{ marginLeft: '10px' }}>
                          <Typography sx={{ fontWeight: 'bold' }}>Public group</Typography>
                          <Typography>Anyone can see who's the group and what they post</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ marginTop: '10px', display: 'flex' }}>
                        <Icon style={{ width: '30px', height: '30px' }} icon="dashicons:lock" />
                        <Box sx={{ marginLeft: '10px' }}>
                          <Typography sx={{ fontWeight: 'bold' }}>Private group</Typography>
                          <Typography>
                            Only members can see who's in the group and what they post
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    <Box sx={{ marginTop: '10px', display: 'flex' }}>
                      <Icon style={{ width: '30px', height: '30px' }} icon="el:eye-open" />
                      <Box sx={{ marginLeft: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Visible</Typography>
                        <Typography>Anyone can find this group</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ marginTop: '10px', display: 'flex' }}>
                      <Icon
                        style={{ width: '30px', height: '30px' }}
                        icon="fluent:people-32-filled"
                      />
                      <Box sx={{ marginLeft: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>General</Typography>
                      </Box>
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

export default CreateGroup;
