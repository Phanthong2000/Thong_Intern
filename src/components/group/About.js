import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Divider, styled, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  display: 'block',
  padding: '10px 0px'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '18px'
}));
About.prototype = {
  group: PropTypes.object
};
function About({ group }) {
  const [allPosts, setAllPosts] = useState(0);
  const getAllPosts = async (id) => {
    const data = await getDocs(
      query(collection(db, 'posts'), where('groupId', '==', id), where('allow', '==', true))
    );
    if (!data.empty) {
      setAllPosts(data.docs.length);
    }
  };
  useEffect(() => {
    if (group.id !== undefined) getAllPosts(group.id);
    return () => null;
  }, [group]);
  const Information = ({ title, icon, info }) => {
    const IconInfo = styled(Icon)(({ theme }) => ({
      width: '25px',
      height: '25px',
      color: 'gray'
    }));
    return (
      <Box sx={{ display: 'flex' }}>
        <IconInfo icon={icon} />
        <Box sx={{ marginLeft: '10px' }}>
          <Title>{title}</Title>
          <Typography sx={{ fontSize: '12px', color: 'gray' }}>{info}</Typography>
        </Box>
      </Box>
    );
  };
  return (
    <RootStyle>
      <Card sx={{ width: '50%', marginLeft: '25%', padding: '10px', background: '#fff' }}>
        <Title>About this group</Title>
        <Divider sx={{ margin: '10px 0px' }} />
        {group.status === 'public' ? (
          <Information
            title="Public"
            icon="carbon:earth-filled"
            info="Anyone can see who's the group and what they post"
          />
        ) : (
          <Information
            title="Public"
            icon="dashicons:lock"
            info="Only members can see who's in the group and what they post"
          />
        )}
        <Information title="Visible" icon="el:eye-open" info="Anyone can find this group" />
        <Information title="General" icon="fluent:people-32-filled" />
      </Card>
      <Card
        sx={{
          width: '50%',
          marginLeft: '25%',
          padding: '10px',
          background: '#fff',
          marginTop: '10px'
        }}
      >
        <Title>Activity</Title>
        <Divider sx={{ margin: '10px 0px' }} />
        <Information title={`${allPosts} total post`} icon="bi:postcard-fill" />
        <Information title="1000 total member" icon="fluent:people-32-filled" />
        <Information
          title={`Created on ${moment(group.createdAt).fromNow()}`}
          icon="eos-icons:subscriptions-created"
        />
      </Card>
    </RootStyle>
  );
}

export default About;
