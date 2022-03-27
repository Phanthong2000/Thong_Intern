import React, { useEffect, useState, useRef } from 'react';
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
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import AvatarFriend from '../profile/AvatarFriend';
import menuPublicConfig from './menuPublicConfig';
import menuPrivateConfig from './menuPrivateConfig';
import About from './About';
import Discussion from './Discussion';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import { actionUserBackdrop } from '../../redux/actions/userAction';
import { actionGetAllGroups, actionGetGroupsYouJoined } from '../../redux/actions/groupAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 355px)',
  background: '#fff'
}));
const AvatarGroup = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '0px 0px 20px 20px',
  height: '400px'
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
  show: PropTypes.func,
  group: PropTypes.object,
  getGroup: PropTypes.func
};
function BoxAvatarGroup({ user, hidden, show, getGroup, group }) {
  const fileRef = useRef();
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const [avatar, setAvatar] = useState(group.avatar);
  const socketRef = useRef();
  const [image, setImage] = useState({});
  const [choosing, setChoosing] = useState(false);
  const socket = useSelector((state) => state.call.socket);
  const [tab, setTab] = useState('discussion');
  const { id } = useParams();
  const dispatch = useDispatch();
  const [anchorElJoined, setAnchorElJoined] = React.useState(null);
  const handleClick = (event) => {
    setAnchorElJoined(anchorElJoined ? null : event.currentTarget);
  };
  const openJoined = Boolean(anchorElJoined);
  useEffect(() => {
    socketRef.current = socket;
    return () => null;
  }, [user]);
  const chooseBackground = (e) => {
    e.stopPropagation();
    fileRef.current.click();
  };
  const onChangeFile = (files) => {
    console.log(files);
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setAvatar(URL.createObjectURL(files[0]));
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
  const cancelChange = () => {
    setChoosing(false);
    setAvatar(group.avatar);
  };
  const saveChange = () => {
    const metadata = {
      contentType: 'image/*'
    };
    dispatch(
      actionUserBackdrop({
        status: true,
        content: 'Change cover photo group'
      })
    );
    const storageRef = ref(storage, `background/${user.id}.${new Date().getTime()}`);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        switch (snapshot.state) {
          case 'running':
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
          updateDoc(doc(db, 'groups', group.id), {
            avatar: downloadURL
          }).then(() => {
            setChoosing(false);
            dispatch(
              actionUserBackdrop({
                status: false,
                content: 'Change cover photo group'
              })
            );
            dispatch(
              actionOpenSnackbar({
                status: true,
                content: 'Changed cover photo group',
                type: 'success'
              })
            );
          });
        });
      }
    );
  };
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
        dispatch(actionGetAllGroups(user.id));
        const userCall = usersSocket.find((user) => user.userId === group.userCreate);
        if (userCall !== undefined)
          socketRef.current.emit('join group public', {
            socketId: userCall.socketId,
            group,
            userJoin: user
          });
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
        dispatch(actionGetAllGroups(user.id));
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Join group success',
            type: 'success'
          })
        );
        const userCall = usersSocket.find((user) => user.userId === group.userCreate);
        if (userCall !== undefined)
          socketRef.current.emit('join group private', {
            socketId: userCall.socketId,
            group,
            userJoin: user
          });
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
      dispatch(actionGetGroupsYouJoined(user.id));
      dispatch(actionGetAllGroups(user.id));
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
      dispatch(actionGetAllGroups(user.id));
      dispatch(
        actionOpenSnackbar({
          status: true,
          content: 'Cancel request success',
          type: 'success'
        })
      );
      const userCall = usersSocket.find((user) => user.userId === group.userCreate);
      if (userCall !== undefined)
        socketRef.current.emit('cancel request', {
          socketId: userCall.socketId,
          group
        });
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
        <IconButton disableTouchRipple sx={{ width: '70%', padding: '0px' }}>
          {choosing && (
            <Box
              sx={{
                width: '100%',
                height: '60px',
                background: '#000',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                top: 0,
                left: 0,
                padding: '0px 10px',
                opacity: 0.7
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  fontFamily: 'sans-serif'
                }}
              >
                Change cover photo group
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonJoined onClick={cancelChange} sx={{ '&:hover': { background: '#fff' } }}>
                  Cancel
                </ButtonJoined>
                <ButtonJoinGroup onClick={saveChange}>Save change</ButtonJoinGroup>
              </Box>
            </Box>
          )}
          <AvatarGroup src={avatar} />
          {group.userCreate === user.id && (
            <Button
              onClick={chooseBackground}
              sx={{
                position: 'absolute',
                textTransform: 'none',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '14px',
                background: 'lightgrey',
                bottom: 20,
                right: 20,
                '&:hover': {
                  background: 'lightgrey'
                }
              }}
              startIcon={<Icon icon="ci:edit" />}
            >
              Edit
            </Button>
          )}
        </IconButton>
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
      {tab === 'about' && <About group={group} />}
      {tab === 'discussion' && <Discussion group={group} user={user} />}
    </RootStyle>
  );
}

export default BoxAvatarGroup;
