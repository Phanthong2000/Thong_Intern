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
  Popover,
  Skeleton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
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
import { useNavigate } from 'react-router-dom';
import ShowMore from 'react-show-more';
import { db } from '../../firebase-config';
import Comment from './Comment';
import {
  actionPostOpenConfirmDeletePost,
  getAllPosts,
  actionGetAllPostAllFriend,
  actionPostModalSharePost
} from '../../redux/actions/postAction';
import Tag from './Tag';
import ModalConfirmDeletePost from './ModalConfirmDeletePost';
import { pushNotificationSocket } from '../../utils/wssConnection';
import { actionGetContact, actionUserHoverUsername } from '../../redux/actions/userAction';
import BoxHoverUsernamePost from '../BoxHoverUsernamePost';

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
Post.prototype = {
  post: PropTypes.object
};
function Post({ post }) {
  const user = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElUsername, setAnchorElUsername] = React.useState(null);
  const open = Boolean(anchorEl);
  const openUS = Boolean(anchorElUsername);
  const inputCommentRef = useRef('');
  const dispatch = useDispatch();
  const [userPost, setUserPost] = useState({});
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentByPostId, setCommentByPostId] = useState([]);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const [notificationLovesByPost, setNotificationLovesByPost] = useState({});
  const [notificationCommentsByPost, setNotificationCommentsByPost] = useState({});
  const [lovesPost, setLovesPost] = useState(post.loves);
  const navigate = useNavigate();
  const [group, setGroup] = useState({});
  const getGroup = (id) => {
    getDoc(doc(db, 'groups', id)).then((snapshot) => {
      setGroup({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  const getNotificationsLovesByPost = () => {
    getDocs(
      query(
        collection(db, 'notifications'),
        where('postId', '==', post.id),
        where('action', '==', 'love')
      )
    ).then((snapshots) => {
      if (!snapshots.empty) {
        setNotificationLovesByPost({
          ...snapshots.docs.at(0).data(),
          id: snapshots.docs.at(0).id
        });
      }
    });
  };
  const getNotificationsCommentsPost = () => {
    getDocs(
      query(
        collection(db, 'notifications'),
        where('postId', '==', post.id),
        where('action', '==', 'comment')
      )
    ).then((snapshots) => {
      if (!snapshots.empty) {
        setNotificationCommentsByPost({
          ...snapshots.docs.at(0).data(),
          id: snapshots.docs.at(0).id
        });
      }
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
  useEffect(() => {
    getUserPost();
    getCommentsByPostId();
    if (post.groupId) {
      getGroup(post.groupId);
    }
    if (post.userId !== user.id) {
      getNotificationsLovesByPost();
      getNotificationsCommentsPost();
    }
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
  const DatePost = () => {
    const DateTime = styled(Typography)(() => ({
      fontSize: '14px',
      color: 'grey'
    }));
    if (new Date().getTime() - post.createdAt < 86400000)
      return <DateTime>{moment(post.createdAt).fromNow()}</DateTime>;
    return <DateTime>{moment(post.createdAt).format('MMMM D, YYYY')}</DateTime>;
  };
  const ContentBackground = () => {
    const BoxBackground = styled(Box)(({ theme }) => ({
      backgroundImage: `url(${post.background})`,
      width: '100%',
      height: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }));
    const ContentBackground = styled(Typography)(() => ({
      fontWeight: 'bold',
      fontSize: '20px',
      color: post.textColor
    }));
    if (post.type === 'background')
      return (
        <BoxBackground>
          <ContentBackground>{post.contentText}</ContentBackground>
        </BoxBackground>
      );
    return null;
  };
  const ContentAvatar = () => {
    const BoxAvatar = styled(Box)(() => ({
      width: '100%',
      height: '400px',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      backgroundImage: `url(${user.background})`,
      backgroundSize: '100% 250px',
      backgroundRepeat: 'no-repeat'
    }));
    const AvatarPost = styled(Avatar)(() => ({
      width: '350px',
      height: '350px',
      outline: `10px solid #fff`,
      cursor: 'pointer'
    }));
    return (
      <BoxAvatar>
        <AvatarPost onClick={goToPhoto} src={post.contentFile} />
      </BoxAvatar>
    );
  };
  const ContentImage = () => {
    const Image = styled('img')(() => ({
      width: '100%',
      marginTop: '5px',
      cursor: 'pointer'
    }));
    if (post.type === 'image')
      return <Image onClick={goToPhoto} src={post.contentFile} alt="post" />;
    return null;
  };
  const ContentCover = () => {
    const Image = styled('img')(() => ({
      width: '100%',
      marginTop: '5px',
      cursor: 'pointer'
    }));
    if (post.type === 'cover')
      return <Image onClick={goToPhoto} src={post.contentFile} alt="post" />;
    return null;
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openOptionsPost = (event) => {
    if (user.id === userPost.id) setAnchorEl(event.currentTarget);
  };
  const handleCloseUsername = () => {
    setAnchorElUsername(null);
  };
  const openUsername = (event) => {
    dispatch(actionGetContact(user.id, userPost.id));
    dispatch(actionUserHoverUsername(userPost));
    setAnchorElUsername(event.currentTarget);
  };
  const deletePost = () => {
    dispatch(actionPostOpenConfirmDeletePost(post.id));
    handleClose();
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
        updateDoc(doc(db, 'posts', post.id), postNew).then(() => {
          setLovesPost(postNew.loves);
          // dispatch(getAllPosts(user.id, 'desc'));
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
          // dispatch(getAllPosts(user.id, 'desc'));
          dispatch(actionGetAllPostAllFriend(user.id));
        });
      }
      if (post.userId !== user.id) {
        const userSocket = usersSocket.find((user) => user.userId === userPost.id);
        if (notificationLovesByPost.id === undefined) {
          const notification = {
            senderIds: [user.id],
            receiverId: userPost.id,
            content: 'loved your post',
            type: 'post',
            action: 'love',
            postId: post.id,
            isRead: false,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
          };
          console.log(notification);
          addDoc(collection(db, 'notifications'), notification).then((docRef) => {
            if (userSocket !== undefined)
              pushNotificationSocket({
                ...notification,
                socketId: userSocket.socketId
              });
            getNotificationsLovesByPost();
          });
        } else if (notificationLovesByPost.senderIds.indexOf(user.id) >= 0) {
          console.log(notificationLovesByPost);
          updateDoc(doc(db, 'notifications', notificationLovesByPost.id), {
            ...notificationLovesByPost,
            senderIds: notificationLovesByPost.senderIds.filter(
              (notification) => notification !== user.id
            )
          }).then(() => {
            if (userSocket !== undefined)
              pushNotificationSocket({
                ...notificationCommentsByPost,
                senderIds: notificationLovesByPost.senderIds.filter(
                  (notification) => notification !== user.id
                ),
                socketId: userSocket.socketId
              });
            getNotificationsLovesByPost();
          });
        } else {
          console.log(notificationLovesByPost);
          updateDoc(doc(db, 'notifications', notificationLovesByPost.id), {
            ...notificationLovesByPost,
            isRead: false,
            updatedAt: new Date().getTime(),
            senderIds: [...notificationLovesByPost.senderIds, user.id]
          }).then(() => {
            if (userSocket !== undefined)
              pushNotificationSocket({
                ...notificationCommentsByPost,
                senderIds: [...notificationLovesByPost.senderIds, user.id],
                socketId: userSocket.socketId
              });
            getNotificationsLovesByPost();
          });
        }
      }
    };
    const comment = () => {
      setIsCommenting(true);
    };
    const share = () => {
      dispatch(
        actionPostModalSharePost({
          status: true,
          post,
          userPost
        })
      );
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
    if (post.status === 'public' && !post.groupId)
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
        addDoc(collection(db, 'comments'), comment).then(() => {
          getCommentsByPostId();
          if (post.userId !== user.id) {
            const userSocket = usersSocket.find((user) => user.userId === userPost.id);
            const notification = {
              senderIds: [user.id],
              receiverId: userPost.id,
              content: 'commented your post',
              type: 'post',
              postId: post.id,
              isRead: false,
              action: 'comment',
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime()
            };
            if (notificationCommentsByPost.id === undefined) {
              addDoc(collection(db, 'notifications'), notification).then((docRef) => {
                if (userSocket !== undefined)
                  pushNotificationSocket({
                    ...notification,
                    id: docRef.id,
                    socketId: userSocket.socketId
                  });
              });
            } else {
              const senderIdsNew = notificationCommentsByPost.senderIds.filter(
                (notification) => notification !== user.id
              );
              updateDoc(doc(db, 'notifications', notificationCommentsByPost.id), {
                ...notificationCommentsByPost,
                senderIds: [...senderIdsNew, user.id],
                isRead: false,
                updatedAt: new Date().getTime()
              }).then(() => {
                if (userSocket !== undefined)
                  pushNotificationSocket({
                    ...notificationCommentsByPost,
                    senderIds: [...senderIdsNew, user.id],
                    isRead: false,
                    updatedAt: new Date().getTime(),
                    socketId: userSocket.socketId
                  });
              });
            }
          }
        });
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
  const Tags = () => {
    if (post.tags.length === 0) return null;
    if (post.tags.length === 1)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ marginLeft: '3px' }}> is with </Typography>
          <Tag userId={post.tags.at(0).userId} />
        </Box>
      );
    if (post.tags.length === 2)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ marginLeft: '3px' }}> is with </Typography>
          <Tag userId={post.tags.at(0).userId} />
          <Typography sx={{ marginLeft: '3px' }}> and 1 other</Typography>
        </Box>
      );
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ marginLeft: '3px' }}> is with </Typography>
        <Tag userId={post.tags.at(0).userId} />
        <Typography
          sx={{
            marginLeft: '3px'
          }}
        >
          and
          <b style={{ cursor: 'pointer' }}>{` ${post.tags.length - 1} others`}</b>
        </Typography>
      </Box>
    );
  };
  const goToPhoto = () => {
    navigate(`/home/photo/${post.id}`);
  };
  return (
    <RootStyle data-aos="zoom-in">
      <StackPost>
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
                      <Username
                        onClick={() => navigate(`/home/other/${userPost.id}`)}
                        onMouseOver={openUsername}
                      >
                        {userPost.username}
                      </Username>
                      <Popover
                        id="basic-menu"
                        anchorEl={anchorElUsername}
                        open={openUS}
                        onClose={handleCloseUsername}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                      >
                        <BoxHoverUsernamePost user={user} />
                      </Popover>
                    </>
                  )}

                  {post.type === 'avatar' && (
                    <Typography sx={{ color: 'gray', marginLeft: '3px' }}>
                      updated his profile picture.
                    </Typography>
                  )}
                  {post.type === 'cover' && (
                    <Typography sx={{ color: 'gray', marginLeft: '3px' }}>
                      updated his cover photo.
                    </Typography>
                  )}
                  <Tags />
                </Box>
                <Stack sx={{ display: 'flex', alignItems: 'center' }} direction="row">
                  <DatePost />
                  <StatusPost />
                </Stack>
              </Stack>
            </Stack>
            <IconButton onClick={openOptionsPost}>
              <Icon icon="bx:bx-dots-horizontal-rounded" />
            </IconButton>
            <Popover
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right'
              }}
            >
              <Stack sx={{ padding: '10px', background: '#fff' }}>
                <Button
                  sx={{ color: 'gray', textTransform: 'none', justifyContent: 'left' }}
                  startIcon={<Icon style={{ marginLeft: '5px' }} icon="bytesize:edit" />}
                >
                  Edit post
                </Button>
                <Button
                  sx={{ color: 'gray', textTransform: 'none', justifyContent: 'left' }}
                  startIcon={<StatusPost />}
                >
                  Edit audience
                </Button>
                <Divider sx={{ margin: `10px 0px` }} />
                <Button
                  onClick={deletePost}
                  sx={{ color: 'gray', textTransform: 'none', justifyContent: 'left' }}
                  startIcon={<Icon style={{ marginLeft: '5px' }} icon="ion:trash-outline" />}
                >
                  Delete post
                </Button>
              </Stack>
            </Popover>
          </BoxInfoUserPost>
        )}

        {post.type !== 'background' ? (
          <>
            <ShowMore
              lines={4}
              more={
                <Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show more</Typography>
              }
              less={
                <Typography sx={{ fontWeight: 'bold', color: '#30ab78' }}>Show less</Typography>
              }
            >
              <Typography sx={{ maxWidth: '100%' }}>{post.contentText}</Typography>
            </ShowMore>
            <ContentImage />
          </>
        ) : (
          <ContentBackground />
        )}
        {post.type === 'avatar' && <ContentAvatar />}
        {post.type === 'cover' && <ContentCover />}
        <InfoContact />
        <ButtonContact />
        <Divider />
        {isCommenting ? <CommentPost /> : null}
      </StackPost>
    </RootStyle>
  );
}

export default Post;
