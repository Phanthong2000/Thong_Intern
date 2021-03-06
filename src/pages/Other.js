import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Stack, styled, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { db } from '../firebase-config';
import BackgroundImage from '../components/other/BackgroundImage';
import Information from '../components/other/Infomation';
import Intro from '../components/other/Intro';
import UpPost from '../components/other/UpPost';
import Friends from '../components/other/Friends';
import { getAllPostsOther } from '../redux/actions/postAction';
import Post from '../components/other/Post';
import EmptyPost from '../components/profile/EmptyPost';
import { actionGetAllFriendOther } from '../redux/actions/userAction';
import { actionChatGetChatbox } from '../redux/actions/chatAction';
import SharePost from '../components/post/SharePost';

const RootStyle = styled(Stack)(({ theme }) => ({
  marginTop: '60px',
  background: theme.palette.background,
  height: '100%',
  alignItems: 'center'
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '800px',
  [theme.breakpoints.down('md')]: {
    width: '95%'
  }
}));
Other.prototype = {
  user: PropTypes.object
};
function Other({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [other, setOther] = useState({});
  const postsOther = useSelector((state) => state.post.postsOther);
  const isLoadingPostsOther = useSelector((state) => state.post.isLoadingPostsOther);
  const dispatch = useDispatch();
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      if (snapshot.data() === undefined) {
        navigate('/home/user-not-found');
      } else {
        if (id === user.id) navigate(`/home/profile/${user.id}`);
        setOther({
          ...snapshot.data(),
          id
        });
        document.title = `${snapshot.data().username} | Thong Intern`;
      }
    });
    dispatch(getAllPostsOther(id, 'desc'));
    dispatch(actionGetAllFriendOther(id));
    dispatch(
      actionChatGetChatbox({
        id: '',
        user: {}
      })
    );
    return () => null;
  }, [user, id]);
  const BoxPost = () => {
    if (postsOther.length === 0) return <EmptyPost />;
    return (
      <>
        {postsOther.map((item, index) => (
          <>
            {item.type === 'share' ? (
              <SharePost key={index} post={item} user={user} />
            ) : (
              <Post post={item} key={index} user={user} />
            )}
          </>
        ))}
      </>
    );
  };
  if (other.id === undefined) return null;
  return (
    <RootStyle>
      <BackgroundImage user={user} />
      <Information user={user} />
      <BoxContent>
        <Grid container>
          <Grid item xs={12} sm={12} lg={5} md={5}>
            <Intro user={user} />
            <Friends user={user} />
          </Grid>
          <Grid item lg={0.2} md={0.2}>
            {' '}
          </Grid>
          <Grid item xs={12} sm={12} lg={6.8} md={6.8}>
            <UpPost user={user} />
            {isLoadingPostsOther ? (
              <Icon
                style={{
                  width: '50px',
                  height: '50px',
                  marginTop: '50px',
                  color: 'gray',
                  marginLeft: '50%'
                }}
                icon="eos-icons:loading"
              />
            ) : (
              <BoxPost />
            )}
          </Grid>
        </Grid>
      </BoxContent>
    </RootStyle>
  );
}

export default Other;
