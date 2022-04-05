import { Box, styled } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import UserReaction from './UserReaction';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%'
}));
function BoxLikeReaction() {
  const modalReactionsPost = useSelector((state) => state.post.modalReactionsPost);
  return (
    <RootStyle>
      {modalReactionsPost.post.reactions.map((item, index) => {
        if (item.react === 'like') return <UserReaction key={index} reaction={item} />;
        return null;
      })}
    </RootStyle>
  );
}

export default BoxLikeReaction;
