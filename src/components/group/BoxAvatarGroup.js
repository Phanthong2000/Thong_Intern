import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  styled,
  Typography,
  Tab,
  Tabs,
  Skeleton,
  IconButton,
  Popper,
  Card,
  ListItemButton
} from '@mui/material';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import AvatarFriend from '../profile/AvatarFriend';
import menuPublicConfig from './menuPublicConfig';
import menuPrivateConfig from './menuPrivateConfig';
import About from './About';
import Discussion from './Discussion';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import { actionUserBackdrop } from '../../redux/actions/userAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 355px)',
  background: '#fff'
}));
const AvatarGroup = styled('img')(({ theme }) => ({
  width: '70%',
  borderRadius: '0px 0px 20px 20px'
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '70%',
  padding: '10px',
  marginLeft: '15%'
}));
const NameGroup = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '30px',
  fontFamily: 'sans-serif'
}));
const BoxAvatarMembers = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const ButtonJoined = styled(Button)(({ theme }) => ({
  background: theme.palette.background,
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#000',
  fontFamily: 'sans-serif',
  height: '40px',
  display: 'flex',
  alignItems: 'center'
}));
const ButtonJoinGroup = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#fff',
  background: theme.palette.green,
  textTransform: 'none',
  marginLeft: '10px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    background: theme.palette.green
  },
  padding: '5px 10px'
}));
BoxAvatarGroup.prototype = {
  user: PropTypes.object,
  hidden: PropTypes.bool,
  show: PropTypes.func
};
function BoxAvatarGroup({ user, hidden, show }) {
  const [tab, setTab] = useState('discussion');
  const { id } = useParams();
  const [group, setGroup] = useState({});
  const dispatch = useDispatch();
  const [anchorElJoined, setAnchorElJoined] = React.useState(null);
  const handleClick = (event) => {
    setAnchorElJoined(anchorElJoined ? null : event.currentTarget);
  };
  const openJoined = Boolean(anchorElJoined);
  const getGroup = () => {
    getDoc(doc(db, 'groups', id)).then((snapshot) => {
      setGroup({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getGroup();
    return () => null;
  }, [user]);
  const membersGroup = () => {
    if (group.members.length === 1) return `1 member`;
    return `${group.members.length} members`;
  };
  const GetBoxAvatarFriend = () => {
    if (group.members.length <= 4) {
      const temp = group.members.slice(0, group.members.length);
      return (
        <Box sx={{ display: 'flex' }}>
          {temp.map((item, index) => (
            <AvatarFriend key={index} friend={{ friendId: item }} index={index} />
          ))}
        </Box>
      );
    }
    const temp = group.members.slice(0, 3);
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
    if (group.members.includes(user.id))
      return (
        <Box>
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
            {menuPublicConfig.map((item, index) => (
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
    if (group.status === 'public')
      return (
        <Box>
          <Tabs textColor="primary" value={tab} onChange={(event, newValue) => setTab(newValue)}>
            {menuPublicConfig.map((item, index) => (
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
    return (
      <Box>
        <Tabs textColor="primary" value={tab} onChange={(event, newValue) => setTab(newValue)}>
          {menuPrivateConfig.map((item, index) => (
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
  const joinGroup = () => {
    if (group.status === 'public') {
      dispatch(
        actionUserBackdrop({
          status: true,
          content: 'Join group'
        })
      );
      const groupNew = {
        ...group,
        members: [...group.members, user.id]
      };
      updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
        getGroup();
        dispatch(
          actionUserBackdrop({
            status: false,
            content: 'Join group'
          })
        );
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Join group success',
            type: 'success'
          })
        );
      });
    } else {
      const groupNew = {
        ...group,
        requests: [...group.requests, user.id]
      };
      dispatch(
        actionUserBackdrop({
          status: true,
          content: 'Join group'
        })
      );
      updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
        getGroup();
        dispatch(
          actionUserBackdrop({
            status: false,
            content: 'Join group'
          })
        );
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Join group success',
            type: 'success'
          })
        );
      });
    }
  };
  const leaveGroup = () => {
    const groupNew = {
      ...group,
      members: group.members.filter((member) => member !== user.id)
    };
    dispatch(
      actionUserBackdrop({
        status: true,
        content: 'Leave group'
      })
    );
    updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
      handleClick();
      dispatch(
        actionUserBackdrop({
          status: false,
          content: 'Leave group'
        })
      );
      getGroup();
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Leave group success',
          type: 'success'
        })
      );
    });
  };
  const deleteGroup = () => {
    console.log('delete group');
    handleClick();
  };
  const cancelRequest = () => {
    const groupNew = {
      ...group,
      requests: group.requests.filter((request) => request !== user.id)
    };
    dispatch(
      actionUserBackdrop({
        status: true,
        content: 'Cancel request'
      })
    );
    updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
      dispatch(
        actionUserBackdrop({
          status: false,
          content: 'Cancel request'
        })
      );
      getGroup();
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Cancel request success',
          type: 'success'
        })
      );
    });
  };
  if (group.id === undefined)
    return (
      <RootStyle sx={{ width: `100%` }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Skeleton
            sx={{ width: '70%', height: '300px', borderRadius: '0px 0px 20px 20px' }}
            variant="rectangular"
          />
        </Box>
      </RootStyle>
    );
  return (
    <RootStyle sx={{ width: group.userCreate !== user.id || hidden ? `100%` : null }}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {group.userCreate === user.id && hidden && (
          <IconButton onClick={show} sx={{ position: 'absolute', left: 90, top: 70 }}>
            <Icon icon="fluent:panel-left-expand-16-filled" />
          </IconButton>
        )}
        <AvatarGroup src={group.avatar} />
      </Box>
      <BoxInfo>
        <Box sx={{ padding: '20px', background: '#fff' }}>
          <NameGroup>{group.name}</NameGroup>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {group.status === 'public' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                <Icon icon="carbon:earth-filled" />
                <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Public group</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                <Icon icon="dashicons:lock" />
                <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Private group</Typography>
              </Box>
            )}
            <Icon icon="ci:dot-01-xs" />
            <Typography
              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '18px', color: 'gray' }}
            >
              {membersGroup()}
            </Typography>
          </Box>
          <BoxAvatarMembers>
            {group.members.includes(user.id) ? <GetBoxAvatarFriend /> : <Box> </Box>}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {group.members.includes(user.id) && (
                <>
                  <ButtonJoined
                    onClick={handleClick}
                    startIcon={<Icon icon="fluent:people-team-32-filled" />}
                    endIcon={
                      <Icon
                        style={{ width: '15px', height: '15px' }}
                        icon="ant-design:caret-down-filled"
                      />
                    }
                  >
                    Joined
                  </ButtonJoined>
                  <Popper id="simple-popper" open={openJoined} anchorEl={anchorElJoined}>
                    <Card sx={{ background: '#fff' }}>
                      {group.userCreate === user.id ? (
                        <ListItemButton onClick={deleteGroup}>
                          <Icon
                            style={{ width: '25px', height: '25px' }}
                            icon="la:trash-alt-solid"
                          />
                          <Typography sx={{ marginLeft: '10px', fontWeight: 'bold' }}>
                            Delete group
                          </Typography>
                        </ListItemButton>
                      ) : (
                        <ListItemButton onClick={leaveGroup}>
                          <Icon style={{ width: '25px', height: '25px' }} icon="mdi-light:logout" />
                          <Typography sx={{ marginLeft: '10px', fontWeight: 'bold' }}>
                            Leave group
                          </Typography>
                        </ListItemButton>
                      )}
                    </Card>
                  </Popper>
                  <ButtonJoinGroup startIcon={<Icon icon="eva:plus-fill" />}>
                    Invite
                  </ButtonJoinGroup>
                  <Button
                    sx={{
                      marginLeft: '10px',
                      height: '40px',
                      color: '#000',
                      background: 'lightgrey'
                    }}
                  >
                    <Icon
                      style={{ width: '20px', height: '20px' }}
                      icon="akar-icons:chevron-down"
                    />
                  </Button>
                </>
              )}
              {group.requests.includes(user.id) && (
                <>
                  <ButtonJoined onClick={cancelRequest}>Cancel Request</ButtonJoined>
                  <Button
                    sx={{
                      marginLeft: '10px',
                      height: '40px',
                      color: '#000',
                      background: 'lightgrey'
                    }}
                  >
                    <Icon
                      style={{ width: '20px', height: '20px' }}
                      icon="akar-icons:chevron-down"
                    />
                  </Button>
                </>
              )}
              {!group.members.includes(user.id) && !group.requests.includes(user.id) && (
                <>
                  <ButtonJoinGroup
                    onClick={joinGroup}
                    startIcon={<Icon icon="fluent:people-team-32-filled" />}
                  >
                    Join Group
                  </ButtonJoinGroup>
                  <Button
                    sx={{
                      marginLeft: '10px',
                      height: '40px',
                      color: '#000',
                      background: 'lightgrey'
                    }}
                  >
                    <Icon
                      style={{ width: '20px', height: '20px' }}
                      icon="akar-icons:chevron-down"
                    />
                  </Button>
                </>
              )}
            </Box>
          </BoxAvatarMembers>
        </Box>
        <Divider sx={{ marginTop: '5px' }} />
        <BoxMenu />
      </BoxInfo>
      {tab === 'about' && <About group={group} />}
      {tab === 'discussion' && <Discussion group={group} user={user} />}
    </RootStyle>
  );
}

export default BoxAvatarGroup;
