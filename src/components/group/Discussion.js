import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, Divider, Grid, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import ModalCreatePost from './ModalCreatePost';
import { actionGroupModalCreatePost } from '../../redux/actions/groupAction';
import { db } from '../../firebase-config';
import Post from '../other/Post';

const RootStyle = styled(Grid)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  display: 'flex',
  justifyContent: 'center'
}));
Discussion.prototype = {
  group: PropTypes.object,
  user: PropTypes.object
};
function Discussion({ group, user }) {
  const dispatch = useDispatch();
  const modalCreatePostGroup = useSelector((state) => state.group.modalCreatePostGroup);
  const [allPosts, setAllPosts] = useState([]);
  const getAllPosts = async (id) => {
    const data = await getDocs(
      query(collection(db, 'posts'), where('groupId', '==', id), where('allow', '==', true))
    );
    if (!data.empty) {
      const allPosts = [];
      data.docs.forEach((post) => {
        allPosts.push({
          ...post.data(),
          id: post.id
        });
      });
      const allPostsSort = allPosts.sort((a, b) => b.createdAt - a.createdAt);
      setAllPosts(allPostsSort);
    }
  };
  useEffect(() => {
    if (group.id !== undefined) getAllPosts(group.id);
    return () => null;
  }, [group]);
  const UpPost = () => {
    const ButtonUpPost = styled(Button)(({ theme }) => ({
      background: theme.palette.background,
      width: '100%',
      borderRadius: '100px',
      textTransform: 'none',
      fontSize: '18px',
      color: theme.palette.green,
      height: '50px',
      fontWeight: 'bold',
      ':hover': {
        background: 'lightgrey'
      }
    }));
    return (
      <Card sx={{ display: 'flex', background: '#fff', padding: '10px' }}>
        <Avatar sx={{ cursor: 'pointer', width: '50px', height: '50px' }} src={user.avatar} />
        <ButtonUpPost
          onClick={() =>
            dispatch(
              actionGroupModalCreatePost({
                status: true,
                group
              })
            )
          }
        >
          Write something ...
        </ButtonUpPost>
      </Card>
    );
  };
  const About = () => {
    const Title = styled(Typography)(({ theme }) => ({
      fontWeight: 'bold',
      fontSize: '18px'
    }));
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
      <Card sx={{ width: '100%', padding: '10px', background: '#fff' }}>
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
            title="Private"
            icon="dashicons:lock"
            info="Only members can see who's in the group and what they post"
          />
        )}
        <Information title="Visible" icon="el:eye-open" info="Anyone can find this group" />
        <Information title="General" icon="fluent:people-32-filled" />
      </Card>
    );
  };
  const BoxPost = () => (
    <Box>
      {allPosts.map((item, index) => (
        <Post post={item} key={index} user={user} />
      ))}
    </Box>
  );
  const BoxPrivate = () => (
    <Card sx={{ width: '100%', textAlign: 'center', padding: '50px', background: '#fff' }}>
      <Icon style={{ width: '100px', height: '100px' }} icon="fluent:document-lock-28-filled" />
      <Typography
        sx={{ fontWeight: 'bold', fontSize: '20px', color: 'gray', fontFamily: 'sans-serif' }}
      >
        This group is private
      </Typography>
      <Typography sx={{ fontSize: '18px', color: 'gray', fontFamily: 'sans-serif' }}>
        Join this group to view or participate in discussions
      </Typography>
    </Card>
  );
  return (
    <RootStyle container>
      <Grid sx={{ padding: '10px', width: '100%' }} item xs={12} sm={12} md={12} lg={4} xl={4}>
        <About />
      </Grid>
      <Grid sx={{ padding: '10px', width: '100%' }} item xs={12} sm={12} md={12} lg={7} xl={7}>
        {!group.members.includes(user.id) && group.status === 'private' ? (
          <BoxPrivate />
        ) : (
          <>
            <UpPost />
            <BoxPost />
          </>
        )}
      </Grid>
      {modalCreatePostGroup.status && (
        <ModalCreatePost getAllPosts={() => getAllPosts(group.id)} user={user} />
      )}
    </RootStyle>
  );
}

export default Discussion;
