import React, { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Input,
  InputBase,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import ShowMoreText from 'react-show-more-text';
import ShowMore from 'react-show-more';
import { db } from '../../firebase-config';

const RootStyle = styled(Card)(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  background: '#fff',
  padding: theme.spacing(1, 1, 1)
}));
const StackPost = styled(Stack)(() => ({
  width: '100%'
}));
const BoxInfoUserPost = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const DotOnline = styled(Icon)(({ theme }) => ({
  position: 'absolute',
  width: '20px',
  height: '20px',
  bottom: '5px',
  right: '5px',
  color: theme.palette.green
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '14px'
}));
Post.prototype = {
  post: PropTypes.object,
  user: PropTypes.object
};
function Post({ user, post }) {
  const [userPost, setUserPost] = useState({});
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const getUserPost = () => {
    getDoc(doc(db, 'users', post.userId)).then((post) => {
      setUserPost({
        ...post.data(),
        id: post.id
      });
    });
  };
  useEffect(() => {
    getUserPost();
  }, []);
  const StatusPost = () => {
    const IconStatus = styled(Icon)(() => ({
      marginLeft: '5px',
      color: 'gray'
    }));
    if (post.status === 'public') return <IconStatus icon="si-glyph:global" />;
    return <IconStatus icon="entypo:lock" />;
  };
  const DatePost = () => {
    const DateTime = styled(Typography)(() => ({
      fontSize: '14px',
      color: 'grey'
    }));
    if (new Date().getTime() - post.createdAt < 86400000)
      return <DateTime>{moment(post.createdAt).fromNow()}</DateTime>;
    return <DateTime>{moment(post.createdAt).format('MMMM D, YYYY')}</DateTime>;
  };
  const ContentImage = () => {
    const Image = styled('img')(() => ({
      width: '100%',
      marginTop: '5px'
    }));
    if (post.type === 'image') return <Image src={post.contentFile} alt="post" />;
    return null;
  };
  const InfoContact = () => {
    const BoxInfoContact = styled(Box)(({ theme }) => ({
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'space-between'
    }));
    if (post.loves.length === 0 && post.comments.length === 0 && post.shares.length === 0)
      return null;
    return (
      <>
        <BoxInfoContact>
          <InfoContactLoves />
          <Box sx={{ display: 'flex' }}>
            <InfoContactComments />
            <InfoContactShares />
          </Box>
        </BoxInfoContact>
        <Divider sx={{ marginTop: '5px' }} />
      </>
    );
  };
  const InfoContactLoves = () => {
    const BoxInfoContactLoves = styled('div')(() => ({
      display: 'flex',
      alignItems: 'center'
    }));
    const checkQuantityLove = () => {
      if (post.loves.length === 1) return `You`;
      if (post.loves.length === 2) return `You and 1 other`;
      return `You and ${post.loves.length} others`;
    };
    const checkQuantityLoveDontHaveUserCurrent = () => {
      if (post.loves.length < 2) return `${post.loves.length} other`;
      return `${post.loves.length} others`;
    };
    if (post.loves.length === 0) return <div> </div>;
    return (
      <BoxInfoContactLoves>
        <Icon
          icon="ant-design:heart-twotone"
          style={{ color: 'red', width: '20px', height: '20px' }}
        />
        <Typography sx={{ marginLeft: '2px', fontFamily: 'inherit', color: 'gray' }}>
          {post.loves.find((love) => love.userId === user.id) === undefined
            ? checkQuantityLoveDontHaveUserCurrent()
            : checkQuantityLove()}
        </Typography>
      </BoxInfoContactLoves>
    );
  };
  const InfoContactComments = () => {
    const Comment = styled(Typography)(() => ({
      color: 'gray',
      fontFamily: 'inherit'
    }));
    const checkQuantityComments = () => {
      if (post.comments.length === 0) return ` `;
      if (post.comments.length === 1) return `1 Comment`;
      return `${post.comments.length} Comments`;
    };
    return <Comment>{checkQuantityComments()}</Comment>;
  };
  const InfoContactShares = () => {
    const Share = styled(Typography)(() => ({
      color: 'gray',
      fontFamily: 'inherit',
      marginLeft: '5px'
    }));
    const checkQuantityShares = () => {
      if (post.shares.length === 0) return ` `;
      if (post.shares.length === 1) return `1 Share`;
      return `${post.comments.length} Shares`;
    };
    return <Share>{checkQuantityShares()}</Share>;
  };
  const ButtonContact = () => {
    const love = () => {
      console.log('love');
    };
    const comment = () => {
      setIsCommenting(true);
    };
    const share = () => {
      console.log('share');
    };
    const GridItem = styled(Grid)(({ theme }) => ({
      padding: theme.spacing(1, 1, 1)
    }));
    const ButtonItem = ({ click, name, icon }) => (
      <Button
        startIcon={<Icon icon={icon} />}
        sx={{
          width: '100%',
          textTransform: 'none',
          fontFamily: 'inherit',
          fontSize: '17px',
          color:
            name === 'Love' && post.loves.find((love) => love.userId === user.id) !== undefined
              ? '#30ab78'
              : 'gray',
          height: '30px',
          '&:hover': {
            background: '#f5f7f6'
          }
        }}
        onClick={click}
      >
        {name}
      </Button>
    );
    if (post.status === 'public')
      return (
        <Grid container>
          <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
            <ButtonItem name="Love" click={love} icon="ant-design:heart-twotone" />
          </GridItem>
          <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
            <ButtonItem name="Comment" click={comment} icon="akar-icons:comment" />
          </GridItem>
          <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
            <ButtonItem name="Share" click={share} icon="cil:share" />
          </GridItem>
        </Grid>
      );
    return (
      <Grid container>
        <GridItem item xs={6} sm={6} md={6} lg={6} xl={6}>
          <ButtonItem name="Love" click={love} icon="ant-design:heart-twotone" />
        </GridItem>
        <GridItem item xs={6} sm={6} md={6} lg={6} xl={6}>
          <ButtonItem name="Comment" click={comment} icon="akar-icons:comment" />
        </GridItem>
      </Grid>
    );
  };
  const CommentPost = () => {
    const formik = useFormik({
      initialValues: {
        comment: ''
      },
      onSubmit: () => {
        console.log(values.comment);
      }
    });
    const { values, handleSubmit, getFieldProps } = formik;
    const CommentBar = styled(Box)(() => ({
      width: '100%',
      alignItems: 'center',
      display: 'flex',
      marginTop: '10px'
    }));
    const WrapperComment = styled(Box)(({ theme }) => ({
      display: 'flex',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      background: theme.palette.background,
      padding: theme.spacing(0, 2, 0),
      borderRadius: '20px',
      borderWidth: '0px'
    }));
    if (post.comments.length === 0)
      return (
        <CommentBar container spacing={2}>
          <Grid sx={{ textAlign: 'center' }} item xs={2} sm={2} md={2} lg={2} xl={2}>
            <Button
              sx={{
                '&:hover': { backgroundColor: 'transparent' },
                '&:focus': { backgroundColor: 'transparent' }
              }}
            >
              <Avatar sx={{ width: '30px', height: '30px' }} src={userPost.avatar} />
              <DotOnline icon="ci:dot-05-xl" style={userPost.isOnline ? null : { color: 'grey' }} />
            </Button>
          </Grid>
          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
            <WrapperComment>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <InputBase
                    multiline
                    type="text"
                    {...getFieldProps('comment')}
                    sx={{ width: '100%', fontFamily: 'inherit' }}
                    placeholder="Write a comment"
                  />
                  <Box sx={{ display: 'flex' }}>
                    <IconButton>
                      <Icon icon="akar-icons:image" style={{ width: '20px', height: '20px' }} />
                    </IconButton>
                    <IconButton type="submit">
                      <Icon icon="bi:send" style={{ width: '20px', height: '20px' }} />
                    </IconButton>
                  </Box>
                </Form>
              </FormikProvider>
            </WrapperComment>
          </Grid>
        </CommentBar>
      );
    return <div>cl</div>;
  };
  return (
    <RootStyle>
      <StackPost>
        <BoxInfoUserPost>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              sx={{
                '&:hover': { backgroundColor: 'transparent' },
                '&:focus': { backgroundColor: 'transparent' }
              }}
            >
              <Avatar src={userPost.avatar} />
              <DotOnline icon="ci:dot-05-xl" style={userPost.isOnline ? null : { color: 'grey' }} />
            </Button>
            <Stack>
              <Username>{userPost.username}</Username>
              <Stack sx={{ display: 'flex', alignItems: 'center' }} direction="row">
                <DatePost />
                <StatusPost />
              </Stack>
            </Stack>
          </Stack>
          <IconButton>
            <Icon icon="bx:bx-dots-horizontal-rounded" />
          </IconButton>
        </BoxInfoUserPost>
        <ShowMore
          lines={4}
          more={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show more</Typography>}
          less={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show less</Typography>}
        >
          <Typography>{post.contentText}</Typography>
        </ShowMore>
        <ContentImage />
        <InfoContact />
        <ButtonContact />
        <Divider />
        {isCommenting ? <CommentPost /> : null}
      </StackPost>
    </RootStyle>
  );
}

export default Post;
