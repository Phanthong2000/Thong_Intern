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
  Popper,
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
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import ShowMore from 'react-show-more';
import { db } from '../../firebase-config';
import Comment from '../post/Comment';
import {
  actionPostOpenConfirmDeletePost,
  getAllPosts,
  actionGetAllPostAllFriend,
  actionPostModalSharePost
} from '../../redux/actions/postAction';
import { pushNotificationSocket } from '../../utils/wssConnection';
import { actionGetContact, actionUserHoverUsername } from '../../redux/actions/userAction';
import BoxHoverUsernamePost from '../BoxHoverUsernamePost';

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
const BtnContact = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  fontFamily: 'inherit',
  fontSize: '17px',
  color: 'gray'
}));
const IconButtonReaction = styled(IconButton)(({ theme }) => ({
  width: '40px',
  height: '40px',
  background: '#fff'
}));
const IconReaction = styled(Icon)(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}));
Post.prototype = {
  post: PropTypes.object,
  pageOk: PropTypes.bool,
  getAllPosts: PropTypes.func
};
function Post({ post, getAllPosts, pageOk }) {
  const user = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElUsername, setAnchorElUsername] = React.useState(null);
  const open = Boolean(anchorEl);
  const openUS = Boolean(anchorElUsername);
  const inputCommentRef = useRef('');
  const dispatch = useDispatch();
  const [page, setPage] = useState({});
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentByPostId, setCommentByPostId] = useState([]);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  const [notificationLovesByPost, setNotificationLovesByPost] = useState({});
  const [notificationCommentsByPost, setNotificationCommentsByPost] = useState({});
  const [lovesPost, setLovesPost] = useState(post.loves);
  const navigate = useNavigate();
  const [reactions, setReactions] = useState(post.reactions);
  const [iconHaha, setIconHaha] = useState(false);
  const [iconWow, setIconWow] = useState(false);
  const [iconAngry, setIconAngry] = useState(false);
  const [iconCry, setIconCry] = useState(false);
  const [iconLike, setIconLike] = useState(false);
  const [iconLove, setIconLove] = useState(false);
  const [anchorElReaction, setAnchorElReaction] = React.useState(null);
  const openReaction = Boolean(anchorElReaction);
  const handleClickReaction = (event) => {
    setAnchorElReaction(anchorElReaction ? null : event.currentTarget);
  };
  const comment = () => {
    setIsCommenting(true);
  };
  const getPage = () => {
    getDoc(doc(db, 'pages', post.userId)).then((post) => {
      setPage({
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
    getPage();
    getCommentsByPostId();
    return () => null;
  }, []);
  const like = () => {
    getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
      const oldReactions = snapshot
        .data()
        .reactions.filter((reaction) => reaction.userId === user.id);
      if (oldReactions.length === 0) {
        const newReactions = [...snapshot.data().reactions, { react: 'like', userId: user.id }];
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: newReactions
        }).then(() => {
          setIconLike(false);
          handleClickReaction();
        });
      } else if (oldReactions.at(0).react === 'like') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconLike(false);
          handleClickReaction();
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'like', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'like', userId: user.id }]
        }).then(() => {
          setIconLike(false);
          handleClickReaction();
        });
      }
    });
  };
  const love = () => {
    getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
      const oldReactions = snapshot
        .data()
        .reactions.filter((reaction) => reaction.userId === user.id);
      if (oldReactions.length === 0) {
        const newReactions = [...snapshot.data().reactions, { react: 'love', userId: user.id }];
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: newReactions
        }).then(() => {
          setIconLove(false);
          handleClickReaction();
        });
      } else if (oldReactions.at(0).react === 'love') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconLove(false);
          handleClickReaction();
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'love', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'love', userId: user.id }]
        }).then(() => {
          setIconHaha(false);
          handleClickReaction();
        });
      }
    });
  };
  const haha = () => {
    getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
      const oldReactions = snapshot
        .data()
        .reactions.filter((reaction) => reaction.userId === user.id);
      if (oldReactions.length === 0) {
        const newReactions = [...snapshot.data().reactions, { react: 'haha', userId: user.id }];
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: newReactions
        }).then(() => {
          setIconHaha(false);
          handleClickReaction();
        });
      } else if (oldReactions.at(0).react === 'haha') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconHaha(false);
          handleClickReaction();
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'haha', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'haha', userId: user.id }]
        }).then(() => {
          setIconHaha(false);
          handleClickReaction();
        });
      }
    });
  };
  const wow = () => {
    getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
      const oldReactions = snapshot
        .data()
        .reactions.filter((reaction) => reaction.userId === user.id);
      if (oldReactions.length === 0) {
        const newReactions = [...snapshot.data().reactions, { react: 'wow', userId: user.id }];
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: newReactions
        }).then(() => {
          setIconWow(false);
          handleClickReaction();
        });
      } else if (oldReactions.at(0).react === 'wow') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconWow(false);
          handleClickReaction();
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'wow', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'wow', userId: user.id }]
        }).then(() => {
          setIconWow(false);
          handleClickReaction();
        });
      }
    });
  };
  const angry = () => {
    getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
      const oldReactions = snapshot
        .data()
        .reactions.filter((reaction) => reaction.userId === user.id);
      if (oldReactions.length === 0) {
        const newReactions = [...snapshot.data().reactions, { react: 'angry', userId: user.id }];
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: newReactions
        }).then(() => {
          setIconAngry(false);
          handleClickReaction();
        });
      } else if (oldReactions.at(0).react === 'angry') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconAngry(false);
          handleClickReaction();
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'angry', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'angry', userId: user.id }]
        }).then(() => {
          setIconAngry(false);
          handleClickReaction();
        });
      }
    });
  };
  const cry = () => {
    getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
      const oldReactions = snapshot
        .data()
        .reactions.filter((reaction) => reaction.userId === user.id);
      if (oldReactions.length === 0) {
        const newReactions = [...snapshot.data().reactions, { react: 'cry', userId: user.id }];
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: newReactions
        }).then(() => {
          setIconCry(false);
          handleClickReaction();
        });
      } else if (oldReactions.at(0).react === 'cry') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconCry(false);
          handleClickReaction();
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'cry', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'cry', userId: user.id }]
        }).then(() => {
          setIconCry(false);
          handleClickReaction();
        });
      }
    });
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
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openOptionsPost = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUsername = () => {
    setAnchorElUsername(null);
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
    if (reactions.length === 0 && commentByPostId.length === 0 && post.shares.length === 0)
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
    const checkReaction = () => {
      let like = 0;
      let love = 0;
      let haha = 0;
      let angry = 0;
      let wow = 0;
      let cry = 0;
      reactions.forEach((reaction) => {
        if (reaction.react === 'like') like += 1;
        else if (reaction.react === 'love') love += 1;
        else if (reaction.react === 'haha') haha += 1;
        else if (reaction.react === 'wow') wow += 1;
        else if (reaction.react === 'angry') angry += 1;
        else if (reaction.react === 'cry') cry += 1;
      });
      const data = [];
      if (like > 0) data.push('like');
      if (love > 0) data.push('love');
      if (haha > 0) data.push('haha');
      if (wow > 0) data.push('wow');
      if (angry > 0) data.push('angry');
      if (cry > 0) data.push('cry');
      return data;
    };
    const checkQuantityLove = () => {
      if (reactions.length === 1) return `You`;
      if (reactions.length === 2) return `You and 1 other`;
      return `You and ${reactions.length - 1} others`;
    };
    const checkQuantityLoveDontHaveUserCurrent = () => {
      if (reactions.length < 2) return `${reactions.length} other`;
      return `${reactions.length} others`;
    };
    if (reactions.length === 0) return <div> </div>;
    return (
      <BoxInfoContactLoves>
        {checkReaction()
          .slice(0, 3)
          .map((item, index) => {
            if (item === 'like')
              return (
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'blue',
                    borderRadius: '20px',
                    marginLeft: `-5px`,
                    zIndex: `${10 - index}`
                  }}
                >
                  <Icon
                    icon="ant-design:like-filled"
                    style={{
                      color: '#fff',
                      width: '15px',
                      height: '15px'
                    }}
                  />
                </Box>
              );
            if (item === 'love')
              return (
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'red',
                    borderRadius: '20px',
                    marginLeft: `-5px`,
                    zIndex: `${10 - index}`
                  }}
                >
                  <Icon
                    icon="ant-design:heart-filled"
                    style={{
                      color: '#fff',
                      width: '15px',
                      height: '15px'
                    }}
                  />
                </Box>
              );
            if (item === 'haha')
              return (
                <Icon
                  icon="emojione-v1:face-with-tears-of-joy"
                  style={{
                    color: 'red',
                    width: '20px',
                    height: '20px',
                    marginLeft: `-5px`,
                    zIndex: `${10 - index}`
                  }}
                />
              );
            if (item === 'wow')
              return (
                <Icon
                  icon="emojione-v1:frowning-face-with-open-mouth"
                  style={{
                    color: 'red',
                    width: '20px',
                    height: '20px',
                    marginLeft: `-5px`,
                    zIndex: `${10 - index}`
                  }}
                />
              );
            if (item === 'angry')
              return (
                <Icon
                  icon="emojione-v1:pouting-face"
                  style={{
                    color: 'red',
                    width: '20px',
                    height: '20px',
                    marginLeft: `-5px`,
                    zIndex: `${10 - index}`
                  }}
                />
              );
            if (item === 'cry')
              return (
                <Icon
                  icon="emojione-v1:crying-face"
                  style={{
                    color: 'red',
                    width: '20px',
                    height: '20px',
                    marginLeft: `-5px`,
                    zIndex: `${10 - index}`
                  }}
                />
              );
            return null;
          })}
        <Typography sx={{ marginLeft: '2px', fontFamily: 'inherit', color: 'gray' }}>
          {reactions.find((love) => love.userId === user.id) === undefined || reactions.length === 0
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
            ...post,
            loves: [
              ...snapshot.data().loves,
              {
                userId: user.id,
                createdAt: new Date().getTime()
              }
            ]
          };
          updateDoc(doc(db, 'posts', post.id), postNew).then(() => {
            if (pageOk) {
              getAllPosts();
              dispatch(actionGetAllPostAllFriend(user.id));
            }
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
            if (pageOk) {
              getAllPosts();
              dispatch(actionGetAllPostAllFriend(user.id));
            }
          });
        }
      });
    };
    const comment = () => {
      setIsCommenting(true);
    };
    const share = () => {
      dispatch(
        actionPostModalSharePost({
          status: true,
          post,
          page
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
          animation:
            name === 'Love' &&
            lovesPost.find((love) => love.userId === user.id) !== undefined &&
            `${anim} 1s ease alternate`,
          color:
            name === 'Love' &&
            lovesPost.find((love) => love.userId === user.id) !== undefined &&
            lovesPost.length !== 0
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
    // if (post.status === 'public' && !post.groupId)
    //   return (
    //     <Grid container>
    //       <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
    //         <ButtonItem name="Love" click={love} icon="ant-design:heart-twotone" />
    //       </GridItem>
    //       <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
    //         <ButtonItem name="Comment" click={comment} icon="akar-icons:comment" />
    //       </GridItem>
    //       <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
    //         <ButtonItem name="Share" click={share} icon="cil:share" />
    //       </GridItem>
    //     </Grid>
    //   );
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
              <DotOnline icon="ci:dot-05-xl" />
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
              <DotOnline icon="ci:dot-05-xl" />
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
  const goToPhoto = () => {
    navigate(`/home/photo/${post.id}`);
  };
  const goToPage = () => {
    navigate(`/home/pages/${page.id}`);
  };
  return (
    <RootStyle data-aos="zoom-in">
      <StackPost>
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
        <InfoContact />
        <Grid container>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            {reactions.filter((reaction) => reaction.userId === user.id).length === 1 ? (
              <>
                {reactions.filter((reaction) => reaction.userId === user.id).at(0).react ===
                  'like' && (
                  <BtnContact
                    sx={{ color: 'blue' }}
                    startIcon={<Icon style={{ color: 'blue' }} icon="ant-design:like-filled" />}
                    onClick={handleClickReaction}
                  >
                    Like
                  </BtnContact>
                )}
                {reactions.filter((reaction) => reaction.userId === user.id).at(0).react ===
                  'love' && (
                  <BtnContact
                    sx={{ color: 'red' }}
                    startIcon={<Icon style={{ color: 'red' }} icon="ant-design:heart-filled" />}
                    onClick={handleClickReaction}
                  >
                    Love
                  </BtnContact>
                )}
                {reactions.filter((reaction) => reaction.userId === user.id).at(0).react ===
                  'haha' && (
                  <BtnContact
                    sx={{ color: 'orange' }}
                    startIcon={<Icon icon="emojione-v1:face-with-tears-of-joy" />}
                    onClick={handleClickReaction}
                  >
                    Haha
                  </BtnContact>
                )}
                {reactions.filter((reaction) => reaction.userId === user.id).at(0).react ===
                  'wow' && (
                  <BtnContact
                    sx={{ color: 'orange' }}
                    startIcon={<Icon icon="emojione-v1:frowning-face-with-open-mouth" />}
                    onClick={handleClickReaction}
                  >
                    Wow
                  </BtnContact>
                )}
                {reactions.filter((reaction) => reaction.userId === user.id).at(0).react ===
                  'angry' && (
                  <BtnContact
                    sx={{ color: 'orange' }}
                    startIcon={<Icon icon="emojione-v1:pouting-face" />}
                    onClick={handleClickReaction}
                  >
                    Angry
                  </BtnContact>
                )}
                {reactions.filter((reaction) => reaction.userId === user.id).at(0).react ===
                  'cry' && (
                  <BtnContact
                    sx={{ color: 'orange' }}
                    startIcon={<Icon icon="emojione-v1:crying-face" />}
                    onClick={handleClickReaction}
                  >
                    Cry
                  </BtnContact>
                )}
              </>
            ) : (
              <BtnContact
                startIcon={<Icon icon="ant-design:like-outlined" />}
                onClick={handleClickReaction}
              >
                Like
              </BtnContact>
            )}

            <Popper
              placement="top-start"
              id="simple-popper"
              open={openReaction}
              anchorEl={anchorElReaction}
            >
              <Card
                sx={{
                  background: '#fff',
                  borderRadius: '40px',
                  width: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 10px'
                }}
              >
                {!iconLike ? (
                  <IconButtonReaction
                    onMouseEnter={() => setIconLike(true)}
                    sx={{ background: 'blue', '&:hover': { background: 'blue' } }}
                  >
                    <IconReaction style={{ color: '#fff' }} icon="ant-design:like-filled" />
                  </IconButtonReaction>
                ) : (
                  <IconButtonReaction
                    onClick={like}
                    onMouseLeave={() => setIconLike(false)}
                    sx={{ background: 'blue', '&:hover': { background: 'blue' } }}
                  >
                    <IconReaction style={{ color: '#fff' }} icon="ps:fuck" />
                  </IconButtonReaction>
                )}
                {!iconLove ? (
                  <IconButtonReaction
                    onMouseEnter={() => setIconLove(true)}
                    sx={{ background: 'red', '&:hover': { background: 'red' } }}
                  >
                    <IconReaction style={{ color: '#fff' }} icon="ant-design:heart-filled" />
                  </IconButtonReaction>
                ) : (
                  <IconButtonReaction
                    onClick={love}
                    onMouseLeave={() => setIconLove(false)}
                    sx={{ background: 'red', '&:hover': { background: 'red' } }}
                  >
                    <IconReaction
                      style={{ color: '#fff' }}
                      icon="emojione-monotone:heart-with-arrow"
                    />
                  </IconButtonReaction>
                )}
                {!iconHaha ? (
                  <IconReaction
                    onMouseEnter={() => setIconHaha(true)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione-v1:face-with-tears-of-joy"
                  />
                ) : (
                  <IconReaction
                    onClick={haha}
                    onMouseLeave={() => setIconHaha(false)}
                    style={{
                      width: '40px',
                      height: '40px'
                    }}
                    icon="emojione:smiling-face-with-horns"
                  />
                )}
                {!iconWow ? (
                  <IconReaction
                    onMouseEnter={() => setIconWow(true)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione-v1:face-with-open-mouth"
                  />
                ) : (
                  <IconReaction
                    onClick={wow}
                    onMouseLeave={() => setIconWow(false)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione-v1:frowning-face-with-open-mouth"
                  />
                )}
                {!iconAngry ? (
                  <IconReaction
                    onMouseEnter={() => setIconAngry(true)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione-v1:pouting-face"
                  />
                ) : (
                  <IconReaction
                    onClick={angry}
                    onMouseLeave={() => setIconAngry(false)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione:pouting-face"
                  />
                )}
                {!iconCry ? (
                  <IconReaction
                    onMouseEnter={() => setIconCry(true)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione-v1:crying-face"
                  />
                ) : (
                  <IconReaction
                    onClick={cry}
                    onMouseLeave={() => setIconCry(false)}
                    style={{ width: '40px', height: '40px' }}
                    icon="emojione-v1:loudly-crying-face"
                  />
                )}
              </Card>
            </Popper>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <BtnContact onClick={comment} startIcon={<Icon icon="akar-icons:comment" />}>
              Comment
            </BtnContact>
          </Grid>
        </Grid>
        {/* <ButtonContact /> */}
        <Divider />
        {isCommenting ? <CommentPost /> : null}
      </StackPost>
    </RootStyle>
  );
}

export default Post;
