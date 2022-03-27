import React, { useRef } from 'react';
import { Box, Card, Grid, Paper, styled, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { actionGetAllGroups, actionGetGroupsYouJoined } from '../../redux/actions/groupAction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '10px 0px',
  background: theme.palette.background
}));
Discover.prototype = {
  user: PropTypes.object
};
function Discover({ user }) {
  const allGroups = useSelector((state) => state.group.allGroups);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const socketRef = useRef();
  const socket = useSelector((state) => state.call.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Group = ({ group }) => {
    const AvatarGroup = styled('img')(() => ({
      width: '100%',
      height: '250px'
    }));
    const ButtonJoinGroup = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#000',
      background: theme.palette.background,
      fontWeight: 'bold',
      fontSize: '16px',
      width: '100%',
      marginTop: '20px'
    }));
    const checkMembers = () => {
      if (group.members.length === 1) return `1 member`;
      return `${group.members.length} members`;
    };
    const joinGroup = () => {
      socketRef.current = socket;
      if (group.status === 'public') {
        const groupNew = {
          ...group,
          members: [...group.members, user.id]
        };
        updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
          dispatch(actionGetAllGroups(user.id));
          dispatch(actionGetGroupsYouJoined(user.id));
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
        updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
          dispatch(actionGetAllGroups(user.id));
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

    const goToGroup = () => {
      navigate(`/home/groups/${group.id}`);
    };
    return (
      <Grid item sx={{ width: '100%', padding: '10px' }} xs={12} sm={6} md={6} lg={6} xl={6}>
        <Card onClick={goToGroup} sx={{ background: '#fff', cursor: 'pointer' }}>
          <AvatarGroup src={group.avatar} />
          <Box sx={{ padding: '10px' }}>
            <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>
              {group.name}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'gray' }}>
              {checkMembers()}
            </Typography>
            {group.status === 'public' ? (
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', color: 'gray' }}>
                <Icon icon="carbon:earth-filled" />
                <Typography sx={{ marginLeft: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Public group
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', color: 'gray' }}>
                <Icon icon="dashicons:lock" />
                <Typography sx={{ marginLeft: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Private group
                </Typography>
              </Box>
            )}
            {group.requests.includes(user.id) ? (
              <ButtonJoinGroup>Cancel request</ButtonJoinGroup>
            ) : (
              <ButtonJoinGroup onClick={joinGroup}>Join group</ButtonJoinGroup>
            )}
          </Box>
        </Card>
      </Grid>
    );
  };
  return (
    <RootStyle>
      <Grid sx={{ width: '70%', marginLeft: '10%' }} container>
        {allGroups.map((item, index) => (
          <Group key={index} group={item} />
        ))}
      </Grid>
    </RootStyle>
  );
}

export default Discover;
