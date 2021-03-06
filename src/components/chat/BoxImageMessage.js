import React from 'react';
import { Card, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import ImageMessage from './ImageMessage';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 1, 1),
  marginLeft: '10px',
  background: '#fff',
  marginTop: '10px',
  height: '100px',
  display: 'flex',
  alignItems: 'center'
}));
function BoxImageMessage() {
  const imageMessages = useSelector((state) => state.chat.imageMessages);
  return (
    <RootStyle>
      {imageMessages.map((item, index) => (
        <ImageMessage key={index} image={item} index={index} />
      ))}
    </RootStyle>
  );
}

export default BoxImageMessage;
