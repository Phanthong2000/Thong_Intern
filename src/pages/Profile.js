import React, { useEffect, useState } from 'react';
import { Box, Stack, styled } from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import InfoMain from '../components/profile/BackgroundImage';
import Information from '../components/profile/Information';

const RootStyle = styled(Stack)(({ theme }) => ({
  marginTop: '60px',
  background: theme.palette.background,
  height: '100%'
}));
function Profile() {
  const [userById, setUserById] = useState({});
  const { id } = useParams();
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) =>
      setUserById({
        ...snapshot.data(),
        id: snapshot.id
      })
    );
  }, []);
  return (
    <RootStyle sx={{ alignItems: 'center' }}>
      <InfoMain user={userById} />
      <Information user={userById} />
    </RootStyle>
  );
}

export default Profile;
