import React from 'react';
import { Card, styled, Typography } from '@mui/material';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';
import Participant from './Participant';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '250px',
  padding: theme.spacing(2),
  background: '#fff',
  marginBottom: '20px',
  maxHeight: '250px',
  display: 'flex'
}));
const Title = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '16px',
  fontFamily: 'sans-serif'
}));
function Participants() {
  const group = useSelector((state) => state.call.group);
  const participants = useSelector((state) => state.call.participants);
  return (
    <RootStyle>
      <Scrollbar alwaysShowTracks>
        <Title>Participants ({`${participants.members.length}`})</Title>
        {participants.members.map((item, index) => (
          <Participant key={index} otherId={item.userId} />
        ))}
      </Scrollbar>
    </RootStyle>
  );
}

export default Participants;
