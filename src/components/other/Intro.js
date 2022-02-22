import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Divider, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { collection, getDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(({ theme }) => ({
  background: '#fff',
  marginTop: '20px',
  padding: theme.spacing(2, 1, 2)
}));
const Title = styled(Typography)(() => ({
  fontSize: '22px',
  fontWeight: 'bold',
  fontFamily: 'sans-serif'
}));
Intro.prototype = {
  user: PropTypes.object
};
function Intro({ user }) {
  const { id } = useParams();
  const [other, setOther] = useState({});
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      setOther({ ...snapshot.data(), id });
    });
    return () => null;
  }, [user]);
  const Information = ({ content, information, icon }) => {
    const WrapperContent = styled('div')(() => ({
      display: 'flex',
      marginTop: '10px',
      fontSize: '16px'
    }));
    const Content = styled(Typography)(() => ({
      fontSize: '16px',
      fontFamily: 'sans-serif',
      marginLeft: '10px',
      width: '90%'
    }));
    if (information === undefined || information === null) return null;
    return (
      <WrapperContent>
        <Icon fontSize={30} style={{ color: 'grey' }} icon={icon} />
        <Content>
          {content}
          <b> {information}</b>
        </Content>
      </WrapperContent>
    );
  };
  return (
    <RootStyle>
      <Title>Intro</Title>
      <Divider />
      <Information
        content="Relationship"
        information={user.relationship}
        icon="ant-design:heart-filled"
      />
      <Information content="From" information={other.hometown} icon="gis:position" />
      <Information content="Lives in" information={other.address} icon="bi:house-fill" />
      <Information content="University" information={other.university} icon="mdi:school" />
      <Information content="High school" information={other.highSchool} icon="mdi:school" />
    </RootStyle>
  );
}

export default Intro;
