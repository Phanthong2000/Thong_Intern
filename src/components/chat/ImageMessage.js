import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, styled } from '@mui/material';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { actionChatDeleteImageMessage } from '../../redux/actions/chatAction';

const RootStyle = styled(Box)(() => ({
  width: '70px',
  height: '55px',
  display: 'flex',
  marginLeft: '10px',
  marginTop: '10px'
}));
const Img = styled('img')(() => ({
  width: '70px',
  height: '50px'
}));
ImageMessage.prototype = {
  image: PropTypes.object,
  index: PropTypes.number
};
function ImageMessage({ image, index }) {
  const dispatch = useDispatch();
  const deleteImageMessage = () => {
    dispatch(actionChatDeleteImageMessage(index));
  };
  return (
    <RootStyle>
      <Box
        onClick={deleteImageMessage}
        sx={{
          marginRight: '-20px',
          marginTop: '-10px',
          display: 'flex',
          zIndex: 2,
          background: 'gray',
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon style={{ width: '15px', height: '15px', color: '#fff' }} icon="eva:close-fill" />
      </Box>
      <Img src={URL.createObjectURL(image)} />
    </RootStyle>
  );
}

export default ImageMessage;
