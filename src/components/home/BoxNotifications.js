import React, { useEffect, useRef, useState } from 'react';
import { styled, Typography, Divider, List } from '@mui/material';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config';
import Notification from './Notification';

const RootStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: '10px',
  background: '#fff',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  width: '400px',
  top: '60px',
  color: '#000',
  paddingBottom: '10px',
  maxHeight: '500px'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '25px',
  margin: theme.spacing(1, 1, 1)
}));
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 2, 1)
}));
BoxNotifications.prototype = {
  user: PropTypes.object
};
function BoxNotifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const allNotifications = useSelector((state) => state.user.notifications);
  const getNotifications = async (userId) => {
    const data = await getDocs(
      query(collection(db, 'notifications'), where('receiverId', '==', userId))
    );
    const temp = [];
    if (!data.empty) {
      data.docs.forEach((doc) => {
        temp.push({
          ...doc.data(),
          id: doc.id
        });
      });
    }
    if (temp.length === data.docs.length) setNotifications(temp);
  };
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    if (user.id !== undefined) getNotifications(userId);
    return () => null;
  }, []);
  return (
    <RootStyle sx={{ boxShadow: 3 }}>
      <Title>Notifications</Title>
      <Separate />
      <List style={{ display: 'flex', maxHeight: '400px' }}>
        {allNotifications.length >= 1 && (
          <Scrollbar>
            {allNotifications.map((item, index) => (
              <Notification user={user} notification={item} key={index} />
            ))}
          </Scrollbar>
        )}
      </List>
    </RootStyle>
  );
}

export default BoxNotifications;
