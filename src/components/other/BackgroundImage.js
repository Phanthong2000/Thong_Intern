import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(() => ({
  background: '#fff',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  height: '400px'
}));
const CoverImage = styled('img')(({ theme }) => ({
  width: '80%',
  height: '400px',
  borderRadius: theme.spacing(0, 0, 2, 2),
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
BackgroundImage.prototype = {
  user: PropTypes.object
};
function BackgroundImage({ user }) {
  const [background, setBackground] = useState('');
  const { id } = useParams();
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      setBackground(snapshot.data().background);
    });
    return null;
  }, [user]);
  return (
    <RootStyle>
      <CoverImage src={background} />
    </RootStyle>
  );
}

export default BackgroundImage;
