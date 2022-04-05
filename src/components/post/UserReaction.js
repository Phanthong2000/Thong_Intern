import { Avatar, Box, Button, IconButton, Skeleton, styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const AvatarUser = styled(Avatar)(({ theme }) => ({
  width: '50px',
  height: '50px'
}));
const Username = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '16px'
}));
const ButtonContact = styled(Button)(({ theme }) => ({
  color: '#000',
  textTransform: 'none',
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '14px',
  background: 'lightgrey'
}));
const ManualFriend = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '13px',
  color: 'gray'
}));
UserReaction.prototype = {
  reaction: PropTypes.object
};
function UserReaction({ reaction }) {
  const user = useSelector((state) => state.user.user);
  const [userReaction, setUserReaction] = useState({});
  const getUserReaction = async (id) => {
    const data = await getDoc(doc(db, 'users', id));
    setUserReaction({
      ...data.data(),
      id: data.id
    });
  };
  useEffect(() => {
    if (reaction.userId !== undefined) getUserReaction(reaction.userId);
    return () => null;
  }, []);
  const React = () => {
    const BoxIconReact = styled(Box)(({ theme }) => ({
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      borderRadius: '30px',
      right: 8,
      bottom: 8
    }));
    const IconReactLikeLove = styled(Icon)(({ theme }) => ({
      width: '15x',
      height: '15px',
      color: '#fff'
    }));
    const IconFace = styled(Icon)(({ theme }) => ({
      width: '20px',
      height: '20px',
      position: 'absolute',
      right: 8,
      bottom: 8
    }));
    if (reaction.react === 'like')
      return (
        <BoxIconReact sx={{ background: 'blue' }}>
          <IconReactLikeLove icon="ant-design:like-filled" />
        </BoxIconReact>
      );
    if (reaction.react === 'love')
      return (
        <BoxIconReact sx={{ background: 'red' }}>
          <IconReactLikeLove icon="ant-design:heart-filled" />
        </BoxIconReact>
      );
    if (reaction.react === 'haha') return <IconFace icon="emojione-v1:face-with-tears-of-joy" />;
    if (reaction.react === 'wow')
      return <IconFace icon="emojione-v1:frowning-face-with-open-mouth" />;
    if (reaction.react === 'angry') return <IconFace icon="emojione-v1:pouting-face" />;
    if (reaction.react === 'cry') return <IconFace icon="emojione-v1:crying-face" />;
    return null;
  };
  if (userReaction.id === undefined)
    return (
      <RootStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton sx={{ width: '50px', height: '50px' }} variant="circular" />
          <Box sx={{ marginLeft: '10px' }}>
            <Skeleton variant="text" sx={{ width: '200px' }} />
            <Skeleton variant="text" sx={{ width: '100px' }} />
          </Box>
        </Box>
      </RootStyle>
    );
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled>
          <AvatarUser src={userReaction.avatar} />
          <React />
        </IconButton>
        <Box sx={{ marginLeft: '10px' }}>
          <Username>{userReaction.username}</Username>
          {user.id !== userReaction.id && <ManualFriend>2 manual friend</ManualFriend>}
        </Box>
      </Box>
      {user.id !== userReaction.id && (
        <ButtonContact startIcon={<Icon icon="bx:bxs-user-plus" />}>Add friend</ButtonContact>
      )}
    </RootStyle>
  );
}

export default UserReaction;
