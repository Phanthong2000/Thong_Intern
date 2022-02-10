import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import ShowMore from 'react-show-more';
import { db } from '../../firebase-config';

const DotOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  width: '20px',
  height: '20px',
  bottom: '5px',
  right: '5px',
  color: theme.palette.green
}));
const BoxContentComment = styled(Stack)(({ theme }) => ({
  background: theme.palette.background,
  minHeight: '50px',
  padding: theme.spacing(1, 1, 1),
  borderRadius: '10px',
  maxWidth: '100%'
}));
const Username = styled(Typography)(() => ({
  fontFamily: 'inherit',
  fontWeight: 'bold',
  fontSize: '14px'
}));
const Content = styled(Typography)(() => ({
  fontFamily: 'inherit'
}));
const ContentImage = styled('img')(() => ({
  width: '200px',
  height: '200px'
}));
Comment.prototype = {
  comment: PropTypes.object,
  user: PropTypes.object
};
function Comment({ comment, user }) {
  const [userComment, setUserComment] = useState({});
  const getUserComment = () => {
    getDoc(doc(db, 'users', comment.userId)).then((snapshot) => {
      setUserComment({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getUserComment();
  }, []);
  const LoveComment = () => {
    const Love = styled(Typography)(({ theme }) => ({
      color: theme.palette.green,
      fontWeight: 'bold',
      fontSize: '15px',
      width: '20px',
      marginLeft: '20px',
      ':hover': {
        cursor: 'pointer',
        textDecoration: 'underline'
      }
    }));
    if (comment.loves.find((love) => love.userId === user.id) === undefined)
      return <Love sx={{ color: '#000' }}>Love</Love>;
    return <Love>Love</Love>;
  };
  return (
    <Grid sx={{ marginTop: '5px' }} container>
      <Grid sx={{ textAlign: 'center' }} item xs={2} sm={2} md={2} lg={2} xl={2}>
        <Button
          sx={{
            '&:hover': { backgroundColor: 'transparent' },
            '&:focus': { backgroundColor: 'transparent' }
          }}
        >
          <Avatar sx={{ width: '30px', height: '30px' }} src={userComment.avatar} />
          <DotOnline icon="ci:dot-05-xl" style={userComment.isOnline ? null : { color: 'grey' }} />
        </Button>
      </Grid>
      <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
        <Stack
          sx={{ display: 'flex', alignItems: 'center', maxWidth: `calc(100%-60px)` }}
          direction="row"
        >
          <BoxContentComment>
            <Username>{userComment.username}</Username>
            {comment.type === 'text' ? (
              <Content>{comment.content}</Content>
            ) : (
              <ContentImage src={comment.content} alt="Comment" />
            )}
          </BoxContentComment>
          {comment.loves.length === 0 ? null : (
            <Paper
              elevation={3}
              sx={{
                minWidth: '30px',
                height: '30px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '10px',
                '&:hover': {
                  cursor: 'pointer'
                }
              }}
            >
              <Icon
                icon="ant-design:heart-twotone"
                style={{ color: 'red', width: '20px', height: '20px' }}
              />
              <Typography sx={{ fontFamily: 'inherit', color: 'gray' }}>
                {comment.loves.length}
              </Typography>
            </Paper>
          )}
          <IconButton sx={{ width: '30px', height: '30px' }}>
            <Icon icon="bx:bx-dots-horizontal-rounded" />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LoveComment />
          <Typography
            sx={{ marginLeft: '20px', fontFamily: 'inherit', color: 'gray', fontSize: '14px' }}
          >
            {new Date().getTime() - comment.createdAt >= 60000
              ? `${moment(comment.createdAt)
                  .fromNow(true)
                  .substring(0, moment(comment.createdAt).fromNow(true).indexOf(' '))}${moment(
                  comment.createdAt
                )
                  .fromNow(true)
                  .substring(
                    moment(comment.createdAt).fromNow(true).indexOf(' ') + 1,
                    moment(comment.createdAt).fromNow(true).indexOf(' ') + 2
                  )}`
              : `${moment(comment.createdAt).fromNow()}`}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Comment;
