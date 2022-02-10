import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import ShowMore from 'react-show-more';
import { db } from '../../firebase-config';
import Comment from './Comment';
import { getAllPosts } from '../../redux/actions/postAction';

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
  const inputCommentRef = useRef('');
  const dispatch = useDispatch();
  const [userPost, setUserPost] = useState({});
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentByPostId, setCommentByPostId] = useState([]);
  const getUserPost = () => {
    getDoc(doc(db, 'users', post.userId)).then((post) => {
      setUserPost({
        ...post.data(),
        id: post.id
      });
    });
  };
  const getCommentsByPostId = async () => {
    const comments = await getDocs(
      query(collection(db, 'comments'), where('postId', '==', post.id))
    );
    if (!comments.empty) {
      const data = [];
      comments.docs.forEach((comment) => {
        data.push({
          ...comment.data(),
          id: comment.id
        });
      });
      const commentSort = data.sort((a, b) => a.createdAt - b.createdAt);
      setCommentByPostId(commentSort);
    }
  };
  useEffect(() => {
    getUserPost();
    getCommentsByPostId();
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
    if (post.loves.length === 0 && commentByPostId.length === 0 && post.shares.length === 0)
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
      if (commentByPostId.length === 0) return ` `;
      if (commentByPostId.length === 1) return `1 Comment`;
      return `${commentByPostId.length} Comments`;
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
      return `${post.shares.length} Shares`;
    };
    return <Share>{checkQuantityShares()}</Share>;
  };
  const ButtonContact = () => {
    const love = () => {
      if (post.loves.find((love) => love.userId === user.id) === undefined) {
        getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
          const postNew = {
            ...snapshot.data(),
            loves: [
              ...snapshot.data().loves,
              {
                userId: user.id,
                createdAt: new Date().getTime()
              }
            ]
          };
          updateDoc(doc(db, 'posts', post.id), postNew).then(() => dispatch(getAllPosts(user.id)));
        });
      } else {
        getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
          const postNew = {
            ...snapshot.data(),
            loves: [snapshot.data().loves.find((love) => love.userId !== user.id)]
          };
          if (postNew.loves.indexOf(undefined) === 0) {
            updateDoc(doc(db, 'posts', post.id), {
              ...postNew,
              loves: []
            }).then(() => dispatch(getAllPosts(user.id)));
          } else {
            updateDoc(doc(db, 'posts', post.id), {
              ...postNew
            }).then(() => dispatch(getAllPosts(user.id)));
          }
        });
      }
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
    const CommentBar = styled(Box)(() => ({
      width: '100%',
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
    const sendComment = () => {
      const content = inputCommentRef.current;
      if (content.length > 0) {
        const comment = {
          content,
          createdAt: new Date().getTime(),
          loves: [],
          postId: post.id,
          type: 'text',
          userId: user.id
        };
        addDoc(collection(db, 'comments'), comment).then(() => getCommentsByPostId());
      }
      inputCommentRef.current = '';
    };
    if (commentByPostId.length === 0)
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
              <InputBase
                multiline
                type="text"
                onChange={(e) => {
                  inputCommentRef.current = e.target.value;
                }}
                sx={{ width: '100%', fontFamily: 'inherit' }}
                placeholder="Write a comment"
              />
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <IconButton>
                  <Icon icon="akar-icons:image" style={{ width: '20px', height: '20px' }} />
                </IconButton>
                <IconButton onClick={() => sendComment()}>
                  <Icon icon="bi:send" style={{ width: '20px', height: '20px' }} />
                </IconButton>
              </Box>
            </WrapperComment>
          </Grid>
        </CommentBar>
      );
    return (
      <Box>
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
              <InputBase
                autoFocus
                type="text"
                onChange={(e) => {
                  inputCommentRef.current = e.target.value;
                }}
                multiline
                sx={{ width: '100%', fontFamily: 'inherit' }}
                placeholder="Write a comment"
              />
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <IconButton>
                  <Icon icon="akar-icons:image" style={{ width: '20px', height: '20px' }} />
                </IconButton>
                <IconButton onClick={() => sendComment()}>
                  <Icon icon="bi:send" style={{ width: '20px', height: '20px' }} />
                </IconButton>
              </Box>
            </WrapperComment>
          </Grid>
        </CommentBar>
        <Box sx={{ marginTop: '10px' }}>
          {commentByPostId.map((item, index) => (
            <Comment user={user} comment={item} key={index} />
          ))}
        </Box>
      </Box>
    );
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
