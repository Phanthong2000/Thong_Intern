import React from 'react';
import { Card, styled, Typography } from '@mui/material';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '380px',
  padding: theme.spacing(2),
  background: '#fff',
  marginBottom: '20px',
  maxHeight: '380px',
  display: 'flex'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '16px',
  fontFamily: 'sans-serif'
}));
function Participants() {
  const group = useSelector((state) => state.call.group);
  const data = [1, 2, 3, 4, 5];
  return (
    <RootStyle>
      <Scrollbar alwaysShowTracks>
        <Title>Participants ({`${group.members.length}`})</Title>
        {data.map((item, index) => (
          <div style={{ height: '200px' }} key={index}>
            {item}
          </div>
        ))}
      </Scrollbar>
    </RootStyle>
  );
}

export default Participants;
