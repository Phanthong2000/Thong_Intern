import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function Chat() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div id="chat">
      {data.map((item, index) => (
        <div key={index}>{item.author}</div>
      ))}
    </div>
  );
}

export default Chat;
