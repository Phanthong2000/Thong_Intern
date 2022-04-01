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
  styled,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import moment from 'moment';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import ShowMore from 'react-show-more';
import { keyframes } from '@emotion/react';
import { db } from '../../firebase-config';
import { actionGetAllPostAllFriend, getAllPosts } from '../../redux/actions/postAction';
import Comment from './Comment';

const anim = keyframes`
  from{
    transform: scale(1);
  },
  to{
    transform: scale(1.5);
  }
`;
const RootStyle = styled(Card)(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  background: '#fff',
  padding: theme.spacing(1, 1, 1)
}));
const BoxInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center'
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
  fontSize: '13px',
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline'
  }
}));
SharePost.prototype = {
  post: PropTypes.object
};
function SharePost({ post }) {
  const user = useSelector((state) => state.user.user);
  const [userShare, setUserShare] = useState({});
  const [userPost, setUserPost] = useState({});
  const [commentByPostId, setCommentByPostId] = useState([]);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const inputCommentRef = useRef();
  const [isCommenting, setIsCommenting] = useState(false);
  const [lovesPost, setLovesPost] = useState(post.loves);
  const dispatch = useDispatch();
  const getUserPost = () => {
    getDoc(doc(db, 'users', post.post.userId)).then((post) => {
      setUserPost({
        ...post.data(),
        id: post.id
      });
    });
  };
  const getUserShare = () => {
    getDoc(doc(db, 'users', post.userId)).then((post) => {
      setUserShare({
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
    getUserShare();
    getCommentsByPostId();
    return () => null;
  }, []);
  const StatusPost = () => {
    const IconStatus = styled(Icon)(() => ({
      marginLeft: '5px',
      color: 'gray'
    }));
    if (post.status === 'public') return <IconStatus icon="si-glyph:global" />;
    return <IconStatus icon="entypo:lock" />;
  };
  const StatusPostShare = () => {
    const IconStatus = styled(Icon)(() => ({
      marginLeft: '5px',
      color: 'gray'
    }));
    if (post.post.status === 'public') return <IconStatus icon="si-glyph:global" />;
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
  const DatePostShare = () => {
    const DateTime = styled(Typography)(() => ({
      fontSize: '14px',
      color: 'grey'
    }));
    if (new Date().getTime() - post.post.createdAt < 86400000)
      return <DateTime>{moment(post.post.createdAt).fromNow()}</DateTime>;
    return <DateTime>{moment(post.post.createdAt).format('MMMM D, YYYY')}</DateTime>;
  };
  const BoxPostText = () => {
    const PostText = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex'
    }));
    const BoxContent = styled(Box)(({ theme }) => ({
      width: '100%',
      border: `1px solid gray`,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#fff'
    }));
    const BoxInfo = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }));
    return (
      <PostText>
        <BoxContent>
          <BoxInfo>
            <IconButton disabled>
              <Avatar src={userPost.avatar} />
              <DotOnline
                icon="ci:dot-05-xl"
                style={{
                  color:
                    usersSocket.find((socket) => socket.userId === userPost.id) === undefined
                      ? 'gray'
                      : null
                }}
              />
            </IconButton>
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>{userPost.username}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DatePostShare />
                <StatusPostShare />
              </Box>
            </Box>
          </BoxInfo>
          <ShowMore
            lines={4}
            more={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show more</Typography>}
            less={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show less</Typography>}
          >
            <Typography>{post.post.contentText}</Typography>
          </ShowMore>
        </BoxContent>
      </PostText>
    );
  };
  const BoxPostImage = () => {
    const PostImage = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex'
    }));
    const Image = styled('img')(({ theme }) => ({
      width: '100%',
      height: '400px',
      outline: `1px solid gray`
    }));
    const BoxContent = styled(Box)(({ theme }) => ({
      width: '100%',
      border: `1px solid gray`,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#fff'
    }));
    const BoxInfo = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }));
    return (
      <PostImage>
        <BoxContent>
          <Image src={post.post.contentFile} />
          <BoxInfo>
            <IconButton disabled>
              <Avatar src={userPost.avatar} />
              <DotOnline
                icon="ci:dot-05-xl"
                style={{
                  color:
                    usersSocket.find((socket) => socket.userId === userPost.id) === undefined
                      ? 'gray'
                      : null
                }}
              />
            </IconButton>
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>{userPost.username}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DatePostShare />
                <StatusPostShare />
              </Box>
            </Box>
          </BoxInfo>
          <Typography>{post.post.contentText}</Typography>
        </BoxContent>
      </PostImage>
    );
  };
  const BoxPostBackground = () => {
    const PostText = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex'
    }));
    const BoxContent = styled(Box)(({ theme }) => ({
      width: '100%',
      border: `1px solid gray`,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#fff'
    }));
    const BoxInfo = styled(Box)(({ theme }) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }));
    return (
      <PostText>
        <Scrollbar>
          <BoxContent>
            <BoxInfo>
              <IconButton disabled>
                <Avatar sx={{ width: '50px', height: '50px' }} src={userPost.avatar} />
                <DotOnline
                  icon="ci:dot-05-xl"
                  style={{
                    color:
                      usersSocket.find((socket) => socket.userId === userPost.id) === undefined
                        ? 'gray'
                        : null
                  }}
                />
              </IconButton>
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>{userPost.username}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePostShare />
                  <StatusPostShare />
                </Box>
              </Box>
            </BoxInfo>
            <Box
              sx={{
                width: '100%',
                height: '400px',
                backgroundImage: `url(${post.post.background})`,
                backgroundSize: `100% 100%`,
                backgroundRepeat: 'no-repeat',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: post.post.textColor }}>
                {post.post.contentText}
              </Typography>
            </Box>
          </BoxContent>
        </Scrollbar>
      </PostText>
    );
  };
  const InfoContact = () => {
    const BoxInfoContact = styled(Box)(({ theme }) => ({
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'space-between'
    }));
    if (lovesPost.length === 0 && commentByPostId.length === 0 && post.shares.length === 0)
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
      if (lovesPost.length === 1) return `You`;
      if (lovesPost.length === 2) return `You and 1 other`;
      return `You and ${lovesPost.length - 1} others`;
    };
    const checkQuantityLoveDontHaveUserCurrent = () => {
      if (lovesPost.length < 2) return `${lovesPost.length} other`;
      return `${lovesPost.length} others`;
    };
    if (lovesPost.length === 0) return <div> </div>;
    return (
      <BoxInfoContactLoves>
        <Icon
          icon="ant-design:heart-twotone"
          style={{ color: 'red', width: '20px', height: '20px' }}
        />
        <Typography sx={{ marginLeft: '2px', fontFamily: 'inherit', color: 'gray' }}>
          {lovesPost.find((love) => love.userId === user.id) === undefined
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
      getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
        if (snapshot.data().loves.find((love) => love.userId === user.id) === undefined) {
          setLovesPost([
            ...snapshot.data().loves,
            {
              userId: user.id,
              createdAt: new Date().getTime()
            }
          ]);
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
          updateDoc(doc(db, 'posts', post.id), postNew).then(() => {
            // dispatch(getAllPosts(user.id, 'desc'));
            // dispatch(actionGetAllPostAllFriend(user.id));
          });
        } else {
          setLovesPost(snapshot.data().loves.filter((love) => love.userId !== user.id));
          const postNew = {
            ...snapshot.data(),
            loves: snapshot.data().loves.filter((love) => love.userId !== user.id)
          };
          updateDoc(doc(db, 'posts', post.id), {
            ...postNew
          }).then(() => {
            // dispatch(getAllPosts(user.id, 'desc'));
            // dispatch(actionGetAllPostAllFriend(user.id));
          });
        }
      });
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
          animation:
            name === 'Love' &&
            lovesPost.find((love) => love.userId === user.id) !== undefined &&
            `${anim} 1s ease alternate`,
          color:
            name === 'Love' && lovesPost.find((love) => love.userId === user.id) !== undefined
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
              <Avatar sx={{ width: '30px', height: '30px' }} src={user.avatar} />
              <DotOnline
                icon="ci:dot-05-xl"
                style={{
                  color:
                    usersSocket.find((socket) => socket.userId === userPost.id) === undefined
                      ? 'gray'
                      : null
                }}
              />
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
              <Avatar sx={{ width: '30px', height: '30px' }} src={user.avatar} />
              <DotOnline
                icon="ci:dot-05-xl"
                style={{
                  color:
                    usersSocket.find((socket) => socket.userId === userPost.id) === undefined
                      ? 'gray'
                      : null
                }}
              />
            </Button>
          </Grid>
          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
            <WrapperComment>
              <InputBase
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BoxInfo>
          <IconButton disabled>
            <Avatar src={userShare.avatar} />
            <DotOnline
              icon="ci:dot-05-xl"
              style={{
                color:
                  usersSocket.find((socket) => socket.userId === userShare.id) === undefined
                    ? 'gray'
                    : null
              }}
            />
          </IconButton>
          <Box>
            <Username>{userShare.username}</Username>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DatePost />
              <StatusPost />
            </Box>
          </Box>
        </BoxInfo>
        <IconButton>
          <Icon icon="bx:bx-dots-horizontal-rounded" />
        </IconButton>
      </Box>
      <ShowMore
        lines={4}
        more={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show more</Typography>}
        less={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show less</Typography>}
      >
        <Typography>{post.contentText}</Typography>
      </ShowMore>
      {post.post.type === 'text' && <BoxPostText />}
      {post.post.type === 'background' && <BoxPostBackground />}
      {(post.post.type === 'image' || post.post.type === 'avatar') && <BoxPostImage />}
      <InfoContact />
      <ButtonContact />
      {isCommenting && <CommentPost />}
    </RootStyle>
  );
}

export default SharePost;
