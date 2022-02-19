import React from 'react';
import { Avatar, Box, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Scrollbar } from 'smooth-scrollbar-react';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  height: '330px',
  maxHeight: '330px',
  display: 'flex'
}));
BoxMessageChatBox.prototype = {
  user: PropTypes.object,
  other: PropTypes.object
};
function BoxMessageChatBox({ user, other }) {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <RootStyle>
      <Scrollbar>
        {data.map((item, index) => (
          <div key={index} style={{ height: '100px' }}>
            {item}
          </div>
        ))}
      </Scrollbar>
    </RootStyle>
  );
}

export default BoxMessageChatBox;
