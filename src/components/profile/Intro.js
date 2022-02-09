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
const ButtonEdit = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  fontSize: '18px',
  background: theme.palette.background,
  color: '#000',
  fontWeight: 'bold',
  marginTop: '10px'
}));
Intro.prototype = {
  user: PropTypes.object
};
function Intro({ user }) {
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
    if (information === undefined) return null;
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
        content="Marital status"
        information={user.maritalStatus}
        icon="ant-design:heart-filled"
      />
      <Information content="From" information={user.hometown} icon="gis:position" />
      <Information content="Lives in" information={user.address} icon="bi:house-fill" />
      <Information content="University" information={user.university} icon="mdi:school" />
      <Information content="High school" information={user.highSchool} icon="mdi:school" />
      <Information
        content="Junior high school"
        information={user.juniorHighSchool}
        icon="mdi:school"
      />
      <ButtonEdit>Edit detail</ButtonEdit>
    </RootStyle>
  );
}

export default Intro;
