import { Icon } from '@iconify/react';
import {
  Box,
  Card,
  Divider,
  IconButton,
  Modal,
  styled,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'smooth-scrollbar-react';
import { actionPostModalReactionsPost } from '../../redux/actions/postAction';
import BoxAllReactions from './BoxAllReactions';
import BoxAngryReaction from './BoxAngryReaction';
import BoxCryReaction from './BoxCryReaction';
import BoxHahaReaction from './BoxHahaReaction';
import BoxLikeReaction from './BoxLikeReaction';
import BoxLoveReaction from './BoxLoveReaction';

const BoxModal = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2),
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    width: '500px'
  }
}));
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(0, 0, 1)
}));
const BoxIconLikeLove = styled(Box)(({ theme }) => ({
  width: '25px',
  height: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '30px',
  marginRight: '5px'
}));
const IconLikeLove = styled(Icon)(({ theme }) => ({
  width: '20px',
  height: '20px',
  color: '#fff'
}));
const Value = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  color: 'gray',
  textTransform: 'none'
}));
const IconFace = styled(Icon)(({ theme }) => ({
  width: '25px',
  height: '25px',
  marginRight: '5px'
}));
const BoxContent = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '400px',
  maxHeight: '400px',
  display: 'flex'
}));
const TabItem = styled(Tab)(({ theme }) => ({
  minWidth: '20px'
}));
function ModalReactionPost() {
  const modalReactionsPost = useSelector((state) => state.post.modalReactionsPost);
  const [tab, setTab] = useState('all');
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(
      actionPostModalReactionsPost({
        status: false,
        post: {}
      })
    );
  };
  const BoxHeader = () => {
    const Header = styled(Box)(({ theme }) => ({
      width: '100%'
    }));
    const handleChange = (e, newValue) => {
      setTab(newValue);
    };
    const checkQuantity = (name) =>
      modalReactionsPost.post.reactions.filter((reaction) => reaction.react === name).length;
    return (
      <Box sx={{ width: '90%' }}>
        <Tabs onChange={handleChange} value={tab}>
          <TabItem value="all" label={<Value sx={{ fontSize: '20px' }}>All</Value>} />
          {checkQuantity('like') > 0 && (
            <TabItem
              value="like"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BoxIconLikeLove sx={{ background: 'blue' }}>
                    <IconLikeLove icon="ant-design:like-filled" />
                  </BoxIconLikeLove>
                  <Value>{checkQuantity('like')}</Value>
                </Box>
              }
            />
          )}
          {checkQuantity('love') > 0 && (
            <TabItem
              value="love"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BoxIconLikeLove sx={{ background: 'red' }}>
                    <IconLikeLove icon="ant-design:heart-filled" />
                  </BoxIconLikeLove>
                  <Value>{checkQuantity('love')}</Value>
                </Box>
              }
            />
          )}
          {checkQuantity('haha') > 0 && (
            <TabItem
              value="haha"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconFace icon="emojione-v1:face-with-tears-of-joy" />
                  <Value>{checkQuantity('haha')}</Value>
                </Box>
              }
            />
          )}
          {checkQuantity('wow') > 0 && (
            <TabItem
              value="wow"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconFace icon="emojione-v1:frowning-face-with-open-mouth" />
                  <Value>{checkQuantity('wow')}</Value>
                </Box>
              }
            />
          )}
          {checkQuantity('angry') > 0 && (
            <TabItem
              value="angry"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconFace icon="emojione-v1:pouting-face" />
                  <Value>{checkQuantity('angry')}</Value>
                </Box>
              }
            />
          )}
          {checkQuantity('cry') > 0 && (
            <TabItem
              value="cry"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconFace icon="emojione-v1:crying-face" />
                  <Value>{checkQuantity('cry')}</Value>
                </Box>
              }
            />
          )}
        </Tabs>
      </Box>
    );
  };
  return (
    <Modal open={modalReactionsPost.status} onClose={handleClose}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BoxHeader />
          <IconButton
            onClick={handleClose}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Separate />
        <BoxContent>
          <Scrollbar alwaysShowTracks>
            {tab === 'all' && <BoxAllReactions />}
            {tab === 'like' && <BoxLikeReaction />}
            {tab === 'love' && <BoxLoveReaction />}
            {tab === 'haha' && <BoxHahaReaction />}
            {tab === 'angry' && <BoxAngryReaction />}
            {tab === 'cry' && <BoxCryReaction />}
            <Box> </Box>
          </Scrollbar>
        </BoxContent>
      </BoxModal>
    </Modal>
  );
}

export default ModalReactionPost;
