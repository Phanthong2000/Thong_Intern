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
import { useNavigate } from 'react-router-dom';
import ShowMore from 'react-show-more';
import { keyframes } from '@emotion/react';
import { db } from '../../firebase-config';
import Comment from './Comment';
import {
  actionPostOpenConfirmDeletePost,
  getAllPosts,
  actionGetAllPostAllFriend,
  actionPostModalSharePost,
  actionPostModalReactionsPost
} from '../../redux/actions/postAction';
import Tag from './Tag';
import ModalConfirmDeletePost from './ModalConfirmDeletePost';
import { pushNotificationSocket } from '../../utils/wssConnection';
import { actionGetContact, actionUserHoverUsername } from '../../redux/actions/userAction';
import BoxHoverUsernamePost from '../BoxHoverUsernamePost';

const anim = keyframes`
  from{
    transform: scale(2);
  },
  to{
    transform: scale(1);
  }
`;
const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
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
const BtnContact = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  fontFamily: 'inherit',
  fontSize: '17px',
  color: 'gray'
}));
Post.prototype = {
  post: PropTypes.object
};
function Post({ post }) {
  const user = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElUsername, setAnchorElUsername] = React.useState(null);
  const [anchorElReaction, setAnchorElReaction] = React.useState(null);
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
  const allPosts = useSelector((state) => state.post.allPosts);
  const navigate = useNavigate();
  const [group, setGroup] = useState({});
  const [iconHaha, setIconHaha] = useState(false);
  const [iconWow, setIconWow] = useState(false);
  const [iconAngry, setIconAngry] = useState(false);
  const [iconCry, setIconCry] = useState(false);
  const [iconLike, setIconLike] = useState(false);
  const [iconLove, setIconLove] = useState(false);
  const [reactions, setReactions] = useState(post.reactions);
  const handleClickReaction = (event) => {
    setAnchorElReaction(anchorElReaction ? null : event.currentTarget);
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
  const openReaction = Boolean(anchorElReaction);
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
  const like = () => {
    handleClickReaction();
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
        });
      } else if (oldReactions.at(0).react === 'like') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconLike(false);
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
        });
      }
    });
  };
  const love = () => {
    handleClickReaction();
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
        });
      } else if (oldReactions.at(0).react === 'love') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconLove(false);
        });
      } else {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions([...newReactions, { react: 'love', userId: user.id }]);
        updateDoc(doc(db, 'posts', post.id), {
          reactions: [...newReactions, { react: 'love', userId: user.id }]
        }).then(() => {
          setIconLove(false);
        });
      }
    });
  };
  const haha = () => {
    handleClickReaction();
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
        });
      } else if (oldReactions.at(0).react === 'haha') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconHaha(false);
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
        });
      }
    });
  };
  const wow = () => {
    handleClickReaction();
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
        });
      } else if (oldReactions.at(0).react === 'wow') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconWow(false);
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
        });
      }
    });
  };
  const angry = () => {
    handleClickReaction();
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
        });
      } else if (oldReactions.at(0).react === 'angry') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconAngry(false);
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
        });
      }
    });
  };
  const cry = () => {
    handleClickReaction();
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
        });
      } else if (oldReactions.at(0).react === 'cry') {
        const newReactions = snapshot
          .data()
          .reactions.filter((reaction) => reaction.userId !== user.id);
        setReactions(newReactions);
        updateDoc(doc(db, 'posts', post.id), { reactions: newReactions }).then(() => {
          setIconCry(false);
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
    const chooseReaction = () => {
      dispatch(
        actionPostModalReactionsPost({
          status: true,
          post: {
            ...post,
            reactions
          }
        })
      );
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

        <Typography
          onClick={chooseReaction}
          sx={{
            marginLeft: '2px',
            fontFamily: 'inherit',
            color: 'gray',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {reactions.find((reaction) => reaction.userId === user.id) === undefined
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
  // const ButtonContact = () => {
  //   const love = () => {
  //     getDoc(doc(db, 'posts', post.id)).then((snapshot) => {
  //       if (snapshot.data().loves.find((love) => love.userId === user.id) === undefined) {
  //         setLovesPost([
  //           ...snapshot.data().loves,
  //           {
  //             userId: user.id,
  //             createdAt: new Date().getTime()
  //           }
  //         ]);
  //         const postNew = {
  //           ...snapshot.data(),
  //           loves: [
  //             ...snapshot.data().loves,
  //             {
  //               userId: user.id,
  //               createdAt: new Date().getTime()
  //             }
  //           ]
  //         };
  //         updateDoc(doc(db, 'posts', post.id), postNew).then(() => {
  //           // dispatch(getAllPosts(user.id, 'desc'));
  //           // dispatch(actionGetAllPostAllFriend(user.id));
  //         });
  //       } else {
  //         setLovesPost(snapshot.data().loves.filter((love) => love.userId !== user.id));
  //         const postNew = {
  //           ...snapshot.data(),
  //           loves: snapshot.data().loves.filter((love) => love.userId !== user.id)
  //         };
  //         updateDoc(doc(db, 'posts', post.id), {
  //           ...postNew
  //         }).then(() => {
  //           // dispatch(getAllPosts(user.id, 'desc'));
  //           // dispatch(actionGetAllPostAllFriend(user.id));
  //         });
  //       }
  //     });
  //     if (post.userId !== user.id) {
  //       getDocs(
  //         query(
  //           collection(db, 'notifications'),
  //           where('postId', '==', post.id),
  //           where('action', '==', 'love')
  //         )
  //       ).then((snapshots) => {
  //         const userSocket = usersSocket.find((user) => user.userId === userPost.id);
  //         if (snapshots.empty) {
  //           const notification = {
  //             senderIds: [user.id],
  //             receiverId: userPost.id,
  //             content: 'loved your post',
  //             type: 'post',
  //             action: 'love',
  //             postId: post.id,
  //             isRead: false,
  //             createdAt: new Date().getTime(),
  //             updatedAt: new Date().getTime()
  //           };
  //           addDoc(collection(db, 'notifications'), notification).then((docRef) => {
  //             if (userSocket !== undefined)
  //               pushNotificationSocket({
  //                 ...notification,
  //                 socketId: userSocket.socketId
  //               });
  //           });
  //         } else if (snapshots.docs.at(0).data().senderIds.indexOf(user.id) >= 0) {
  //           updateDoc(doc(db, 'notifications', snapshots.docs.at(0).id), {
  //             ...snapshots.docs.at(0).data(),
  //             senderIds: snapshots.docs
  //               .at(0)
  //               .data()
  //               .senderIds.filter((notification) => notification !== user.id)
  //           }).then(() => {
  //             if (userSocket !== undefined)
  //               pushNotificationSocket({
  //                 ...snapshots.docs.at(0).data(),
  //                 senderIds: snapshots.docs
  //                   .at(0)
  //                   .data()
  //                   .senderIds.filter((notification) => notification !== user.id),
  //                 socketId: userSocket.socketId
  //               });
  //           });
  //         } else {
  //           updateDoc(doc(db, 'notifications', snapshots.docs.at(0).id), {
  //             ...snapshots.docs.at(0).data(),
  //             isRead: false,
  //             updatedAt: new Date().getTime(),
  //             senderIds: [...snapshots.docs.at(0).data().senderIds, user.id]
  //           }).then(() => {
  //             if (userSocket !== undefined)
  //               pushNotificationSocket({
  //                 ...snapshots.docs.at(0).data(),
  //                 senderIds: [...snapshots.docs.at(0).data().senderIds, user.id],
  //                 socketId: userSocket.socketId
  //               });
  //           });
  //         }
  //       });
  //     }
  //   };
  //   const GridItem = styled(Grid)(({ theme }) => ({
  //     padding: theme.spacing(1, 1, 1)
  //   }));
  //   const ButtonItem = ({ click, name, icon, isHover, onHoverOpen, onHoverClose }) => (
  //     <Button
  //       startIcon={<Icon icon={icon} />}
  //       sx={{
  //         width: '100%',
  //         textTransform: 'none',
  //         fontFamily: 'inherit',
  //         fontSize: '17px'
  //       }}
  //       onMouseEnter={onHoverOpen}
  //       onMouseLeave={onHoverClose}
  //       onClick={click}
  //     >
  //       {name}
  //     </Button>
  //   );
  //   if (post.status === 'public' && !post.groupId)
  //     return (
  //       <Grid container>
  //         <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
  //           <ButtonItem isHover name="Love" click={love} icon="ant-design:heart-twotone" />
  //         </GridItem>
  //         <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
  //           <ButtonItem name="Comment" click={comment} icon="akar-icons:comment" />
  //         </GridItem>
  //         <GridItem item xs={4} sm={4} md={4} lg={4} xl={4}>
  //           <ButtonItem name="Share" click={share} icon="cil:share" />
  //         </GridItem>
  //       </Grid>
  //     );
  //   return (
  //     <Grid container>
  //       <GridItem item xs={6} sm={6} md={6} lg={6} xl={6}>
  //         <ButtonItem name="Love" click={love} icon="ant-design:heart-twotone" />
  //       </GridItem>
  //       <GridItem item xs={6} sm={6} md={6} lg={6} xl={6}>
  //         <ButtonItem name="Comment" click={comment} icon="akar-icons:comment" />
  //       </GridItem>
  //     </Grid>
  //   );
  // };
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
                    usersSocket.find((socket) => socket.userId === user.id) === undefined
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
                    usersSocket.find((socket) => socket.userId === user.id) === undefined
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
                        // onMouseOver={openUsername}
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
        {/* <ButtonContact /> */}
        <Grid container>
          <Grid
            item
            xs={post.status === 'public' ? 4 : 6}
            sm={post.status === 'public' ? 4 : 6}
            md={post.status === 'public' ? 4 : 6}
            lg={post.status === 'public' ? 4 : 6}
            xl={post.status === 'public' ? 4 : 6}
          >
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
                      height: '40px',
                      animation: `${bounce} 1s ease infinite`
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
          <Grid
            item
            xs={post.status === 'public' ? 4 : 6}
            sm={post.status === 'public' ? 4 : 6}
            md={post.status === 'public' ? 4 : 6}
            lg={post.status === 'public' ? 4 : 6}
            xl={post.status === 'public' ? 4 : 6}
          >
            <BtnContact onClick={comment} startIcon={<Icon icon="akar-icons:comment" />}>
              Comment
            </BtnContact>
          </Grid>
          {post.status === 'public' && (
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <BtnContact onClick={share} startIcon={<Icon icon="cil:share" />}>
                Share
              </BtnContact>
            </Grid>
          )}
        </Grid>
        <Divider />
        {isCommenting ? <CommentPost /> : null}
      </StackPost>
    </RootStyle>
  );
}

export default Post;
