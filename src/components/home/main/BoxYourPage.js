import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, styled, Typography } from '@mui/material';
import PageItem from '../../page/PageItem';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%'
}));
function BoxYourPage() {
  const yourPages = useSelector((state) => state.page.yourPages);
  if (yourPages.length === 0) return null;
  return (
    <RootStyle>
      <Typography
        sx={{
          marginTop: '10px',
          display: 'flex',
          fontFamily: 'sans-serif',
          color: 'gray',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Your page
      </Typography>
      {yourPages.map((item, index) => (
        <PageItem key={index} page={item} />
      ))}
      <Divider />
    </RootStyle>
  );
}

export default BoxYourPage;
