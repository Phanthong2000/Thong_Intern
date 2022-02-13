import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Stack,
  styled,
  Typography,
  Button,
  Popover,
  Popper
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  actionGetAllFriendUser,
  actionGetContact,
  actionUserContactUserAndOther
} from '../../redux/actions/userAction';
import AvatarFriend from '../profile/AvatarFriend';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '60%',
  marginTop: '10px',
  background: '#fff',
  padding: theme.spacing(1, 1, 1),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center'
  }
}));
const WrapperInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const AvatarUser = styled(IconButton)(() => ({
  width: '20%'
}));
const AvatarImage = styled(Avatar)(() => ({
  width: '100px',
  height: '100px',
  border: '2px solid #30ab78',
  cursor: 'pointer'
}));
const AvatarButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  bottom: '5px',
  right: '5px',
  background: theme.palette.background
}));
const InfoUser = styled(Stack)(({ theme }) => ({
  width: '78%',
  marginLeft: '2%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '0px'
  }
}));
const Username = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '22px',
  fontFamily: 'sans-serif'
}));
const TotalFriend = styled(Typography)(() => ({
  color: 'grey',
  fontSize: '18px',
  fontFamily: 'sans-serif'
}));
const WrapperButtonContact = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}));
const BoxAvatarFriends = styled(Box)(({ theme }) => ({
  width: '35%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));
const BoxButtonContact = styled(Box)(({ theme }) => ({
  width: '65%',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));
const ButtonContact = styled(Button)(({ theme }) => ({
  color: '#000',
  textDecoration: 'none',
  background: theme.palette.background,
  padding: theme.spacing(0.5, 2, 0.5),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold'
}));
const ButtonChat = styled(Button)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  background: theme.palette.green,
  padding: theme.spacing(0.5, 2, 0.5),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  marginLeft: '10px',
  ':hover': {
    background: theme.palette.green
  }
}));
Information.prototype = {
  user: PropTypes.object
};
function Information({ user }) {
  const { id } = useParams();
  const [other, setOther] = useState({});
  const contact = useSelector((state) => state.user.contact);
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.user.friends);
  useEffect(() => {
    getDoc(doc(db, 'users', id)).then((snapshot) => {
      setOther({ ...snapshot.data(), id });
    });
    dispatch(actionGetAllFriendUser(other.id));
    dispatch(actionGetContact(user.id, other.id));
    return null;
  }, [user]);
  const getTotalFriends = () => {
    if (friends.length < 2) return `${friends.length} Friend`;
    return `${friends.length} Friends`;
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const idPopover = open ? 'simple-popover' : undefined;
  const confirmRequest = () => {
    updateDoc(doc(db, 'contacts', contact.id), { status: true }).then(() => {
      dispatch(
        actionUserContactUserAndOther({
          ...contact,
          status: 'friend',
          createdAt: new Date().getTime()
        })
      );
      handleClose();
    });
  };
  const deleteRequest = () => {
    deleteDoc(doc(db, 'contacts', contact.id)).then(() => {
      dispatch(
        actionUserContactUserAndOther({
          ...contact,
          status: 'none'
        })
      );
      handleClose();
    });
  };
  const addFriend = () => {
    addDoc(collection(db, 'contacts'), {
      senderId: user.id,
      receiverId: other.id,
      status: false,
      createdAt: new Date().getTime()
    }).then(() => {
      dispatch(
        actionUserContactUserAndOther({
          ...contact,
          status: 'sent'
        })
      );
    });
  };
  const BoxRespond = () => {
    const RootStyle = styled(Card)(({ theme }) => ({
      background: theme.palette.background,
      padding: theme.spacing(2, 1, 2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '10px',
      [theme.breakpoints.down('lg')]: {
        display: 'block'
      }
    }));
    const ButtonConfirmRequest = styled(Button)(({ theme }) => ({
      fontFamily: 'inherit',
      background: theme.palette.green,
      color: '#fff',
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      ':hover': {
        background: theme.palette.green
      }
    }));
    const ButtonDeleteRequest = styled(Button)(({ theme }) => ({
      fontFamily: 'inherit',
      background: 'lightgray',
      color: '#000',
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      marginLeft: '5px',
      ':hover': {
        background: 'lightgray'
      }
    }));
    if (contact.status === 'received')
      return (
        <RootStyle>
          <Typography
            sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}
          >{`${other.username} sent you a friend request`}</Typography>
          <Box>
            <ButtonConfirmRequest onClick={confirmRequest}>Confirm request</ButtonConfirmRequest>
            <ButtonDeleteRequest onClick={deleteRequest}>Delete request</ButtonDeleteRequest>
          </Box>
        </RootStyle>
      );
    return null;
  };
  const GetBoxAvatarFriend = () => {
    if (friends.length <= 4) {
      const temp = friends.slice(0, friends.length);
      return (
        <BoxAvatarFriends>
          {temp.map((item, index) => (
            <AvatarFriend key={index} friend={item} index={index} />
          ))}
        </BoxAvatarFriends>
      );
    }
    const temp = friends.slice(0, 3);
    return (
      <BoxAvatarFriends>
        {temp.map((item, index) => (
          <AvatarFriend key={index} friend={item} index={index} />
        ))}
        <Icon
          style={{
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            marginLeft: '-10px',
            color: 'grey'
          }}
          icon="mdi:dots-horizontal-circle"
        />
      </BoxAvatarFriends>
    );
  };
  return (
    <RootStyle>
      <WrapperInfo>
        <AvatarUser sx={{ '&:hover': { backgroundColor: 'transparent' } }} aria-label="Delete">
          <AvatarImage onClick={() => console.log('avatar')} src={other.avatar} />
          <AvatarButton>
            <Icon
              icon="ic:baseline-photo-camera"
              style={{ color: '#000', width: '20px', height: '20px' }}
            />
          </AvatarButton>
        </AvatarUser>
        <InfoUser>
          <Username>{other.username}</Username>
          <TotalFriend>{getTotalFriends()}</TotalFriend>
          <WrapperButtonContact>
            <GetBoxAvatarFriend />
            <BoxButtonContact>
              {contact.status === 'friend' ? (
                <>
                  <ButtonContact
                    onClick={handleClick}
                    startIcon={<Icon icon="bx:bxs-user-check" />}
                  >
                    Friend
                  </ButtonContact>
                  <Popover
                    id={idPopover}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <ButtonContact
                      onClick={deleteRequest}
                      startIcon={<Icon icon="bx:bxs-user-x" />}
                    >
                      Unfriend
                    </ButtonContact>
                  </Popover>
                </>
              ) : null}
              {contact.status === 'received' ? (
                <>
                  <ButtonContact
                    onClick={handleClick}
                    startIcon={<Icon icon="bx:bxs-user-check" />}
                  >
                    Respond
                  </ButtonContact>
                  <Popover
                    id={idPopover}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <Stack>
                      <ButtonContact onClick={confirmRequest}>Confirm request</ButtonContact>
                      <ButtonContact onClick={deleteRequest}>Delete request</ButtonContact>
                    </Stack>
                  </Popover>
                </>
              ) : null}
              {contact.status === 'sent' ? (
                <ButtonContact
                  onClick={deleteRequest}
                  startIcon={<Icon icon="bx:bxs-user-check" />}
                >
                  Remove
                </ButtonContact>
              ) : null}
              {contact.status !== 'sent' &&
              contact.status !== 'received' &&
              contact.status !== 'friend' ? (
                <ButtonContact onClick={addFriend} startIcon={<Icon icon="bx:bxs-user-plus" />}>
                  Add friend
                </ButtonContact>
              ) : null}
              <ButtonChat startIcon={<Icon icon="bi:chat-left-fill" />}>Chat</ButtonChat>
            </BoxButtonContact>
          </WrapperButtonContact>
        </InfoUser>
      </WrapperInfo>
      <BoxRespond />
    </RootStyle>
  );
}

export default Information;
