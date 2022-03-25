import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, Radio, Skeleton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  actionAddSocketIdsJoinRoom,
  actionDeleteSocketIdsJoinRoom
} from '../../redux/actions/callAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  padding: '10px',
  marginTop: '10px',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const AvatarMember = styled(Avatar)(({ theme }) => ({
  width: '40px',
  height: '40px'
}));
MemberAddToRoom.prototype = {
  user: PropTypes.object,
  memberId: PropTypes.string
};
function MemberAddToRoom({ user, memberId }) {
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const [member, setMember] = useState({});
  const [choose, setChoose] = useState(false);
  const dispatch = useDispatch();
  const allPeers = useSelector((state) => state.call.allPeers);
  const me = useSelector((state) => state.call.me);
  const getMember = () => {
    getDoc(doc(db, 'users', memberId)).then((snapshot) => {
      setMember({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getMember();
    return () => null;
  }, [allPeers]);
  const chooseMember = () => {
    const userCall = usersSocket.find((user) => user.userId === memberId);
    if (choose) {
      dispatch(actionDeleteSocketIdsJoinRoom(userCall.socketId));
    } else {
      dispatch(actionAddSocketIdsJoinRoom(userCall.socketId));
    }
    setChoose(!choose);
  };
  const StatusMember = () => {
    const userCall = usersSocket.find((user) => user.userId === memberId);
    if (allPeers.find((peer) => peer.userJoin.id === memberId))
      return <Typography>Joined</Typography>;
    if (userCall === undefined) return <Typography>Offline</Typography>;
    return <Radio sx={{ width: '30px', height: '30px' }} checked={choose} onClick={chooseMember} />;
  };
  if (member.avatar === undefined)
    return (
      <RootStyle>
        <Skeleton variant="circular" sx={{ width: '40px', height: '40px' }} />
        <Skeleton variant="text" sx={{ width: '200px', height: '30px' }} />
        <Skeleton variant="circular" sx={{ width: '20px', height: '20px' }} />
      </RootStyle>
    );
  return (
    <RootStyle>
      <AvatarMember src={member.avatar} />
      <Typography>{member.username}</Typography>
      <StatusMember />
    </RootStyle>
  );
}

export default MemberAddToRoom;
