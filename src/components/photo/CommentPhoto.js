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
  Skeleton,
  styled,
  Typography,
  Stack
} from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import ShowMore from 'react-show-more';
import { Icon } from '@iconify/react';
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
import { useNavigate } from 'react-router-dom';
import { Scrollbar } from 'smooth-scrollbar-react';
import { db } from '../../firebase-config';
import { actionGetAllPostAllFriend, getAllPosts } from '../../redux/actions/postAction';
import Comment from '../post/Comment';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '35%',
  background: '#fff',
  padding: '20px 20px 0px 20px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginTop: '20px'
  }
}));
const BoxInfoUserPost = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px'
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
const AvatarGroup = styled(Button)(({ theme }) => ({
  width: '35px',
  height: '35px',
  borderRadius: '5px'
}));
CommentPhoto.prototype = {
  user: PropTypes.object,
  postCurrent: PropTypes.object
};
function CommentPhoto({ user, postCurrent }) {
  const inputCommentRef = useRef('');
  const [userPost, setUserPost] = useState({});
  const [commentByPostId, setCommentByPostId] = useState([]);
  const [post, setPost] = useState(postCurrent);
  const dispatch = useDispatch();
  const [lovesPost, setLovesPost] = useState(post.loves);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const [group, setGroup] = useState({});
  const [page, setPage] = useState({});
  const navigate = useNavigate();
  const getPage = (id) => {
    getDoc(doc(db, 'pages', id)).then((post) => {
      setPage({
        ...post.data(),
        id: post.id
      });
    });
  };
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
  const getGroup = (id) => {
    getDoc(doc(db, 'groups', id)).then((snapshot) => {
      setGroup({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getUserPost();
    getCommentsByPostId();
    if (post.groupId) {
      getGroup(post.groupId);
    }
    if (post.pageId) {
      getPage(post.pageId);
    }
    return () => null;
  }, [user]);
  const goToPage = () => {
    navigate(`/home/pages/${page.id}`);
  };
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
      return `You and ${post.loves.length - 1} others`;
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
      if (lovesPost.find((love) => love.userId === user.id) === undefined) {
        const postNew = {
          ...post,
          loves: [
            ...lovesPost,
            {
              userId: user.id,
              createdAt: new Date().getTime()
            }
          ]
        };
        console.log(postNew);
        updateDoc(doc(db, 'posts', post.id), postNew).then(() => {
          setLovesPost(postNew.loves);
          dispatch(actionGetAllPostAllFriend(user.id));
        });
      } else {
        const postNew = {
          ...post,
          loves: lovesPost.filter((love) => love.userId !== user.id)
        };
        updateDoc(doc(db, 'posts', post.id), {
          ...postNew
        }).then(() => {
          setLovesPost(postNew.loves);
          dispatch(actionGetAllPostAllFriend(user.id));
        });
      }
    };
    const comment = () => {};
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
  const ContentComment = () => {
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
              <DotOnline icon="ci:dot-05-xl" style={user.isOnline ? null : { color: 'grey' }} />
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
        <Box sx={{ marginTop: '10px', maxHeight: '430px', display: 'flex' }}>
          <Scrollbar alwaysShowTracks>
            {commentByPostId.map((item, index) => (
              <Comment user={user} comment={item} key={index} />
            ))}
          </Scrollbar>
        </Box>
      </Box>
    );
  };
  return (
    <RootStyle>
      {post.pageId ? (
        <BoxInfoUserPost>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            {page.avatar === undefined ? (
              <Skeleton sx={{ width: '40px', height: '40px' }} variant="circular" />
            ) : (
              <Avatar onClick={() => navigate(`/home/pages/${page.id}`)} src={page.avatar} />
            )}
            <Stack sx={{ marginLeft: '10px' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left'
                }}
              >
                {page.name === undefined ? (
                  <Skeleton variant="text" sx={{ width: '100px', height: '20px' }} />
                ) : (
                  <Username onClick={goToPage}>{page.name}</Username>
                )}
              </Box>
              <Stack sx={{ display: 'flex', alignItems: 'center' }} direction="row">
                <DatePost />
                <StatusPost />
                <Icon icon="ci:dot-01-xs" />
                <Icon icon="fontisto:flag" />
              </Stack>
            </Stack>
          </Stack>
          <IconButton>
            <Icon icon="bx:bx-dots-horizontal-rounded" />
          </IconButton>
        </BoxInfoUserPost>
      ) : (
        <>
          {post.groupId ? (
            <BoxInfoUserPost>
              <Box sx={{ display: 'flex' }}>
                <AvatarGroup
                  sx={{
                    backgroundImage: `url(${group.avatar})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%'
                  }}
                >
                  <Avatar
                    sx={{
                      width: '25px',
                      height: '25px',
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      outline: `1px solid #000`
                    }}
                    src={user.avatar}
                  />
                </AvatarGroup>
                <Box sx={{ marginLeft: '15px' }}>
                  <Username onClick={() => navigate(`/home/groups/${group.id}`)}>
                    {group.name}
                  </Username>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>
                      {userPost.username}
                    </Typography>
                    <Icon icon="ci:dot-01-xs" />
                    <DatePost />
                    <Icon icon="ci:dot-01-xs" />
                    <Icon icon="el:group-alt" />
                  </Box>
                </Box>
              </Box>
              <IconButton>
                <Icon icon="bx:bx-dots-horizontal-rounded" />
              </IconButton>
            </BoxInfoUserPost>
          ) : (
            <BoxInfoUserPost>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Button
                  sx={{
                    '&:hover': { backgroundColor: 'transparent' },
                    '&:focus': { backgroundColor: 'transparent' }
                  }}
                >
                  {userPost.avatar === undefined ? (
                    <Skeleton sx={{ width: '40px', height: '40px' }} variant="circular" />
                  ) : (
                    <Avatar
                      onClick={() => navigate(`/home/other/${userPost.id}`)}
                      src={userPost.avatar}
                    />
                  )}
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
                <Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                    {userPost.username === undefined ? (
                      <Skeleton variant="text" sx={{ width: '100px', height: '20px' }} />
                    ) : (
                      <>
                        <Username onClick={() => navigate(`/home/other/${userPost.id}`)}>
                          {userPost.username}
                        </Username>
                      </>
                    )}
                  </Box>
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
          )}
        </>
      )}
      <Box sx={{ marginTop: '10px' }}>
        <ShowMore
          lines={2}
          more={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show more</Typography>}
          less={<Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show less</Typography>}
        >
          <Typography sx={{ maxWidth: '100%' }}>{post.contentText} </Typography>
        </ShowMore>
      </Box>
      <InfoContact />
      <ButtonContact />
      <ContentComment />
    </RootStyle>
  );
}

export default CommentPhoto;
