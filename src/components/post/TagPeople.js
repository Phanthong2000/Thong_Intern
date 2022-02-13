import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  Modal,
  styled,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { actionPostCloseTagPeople, actionPostSetTags } from '../../redux/actions/postAction';

const BoxModal = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2),
  display: 'block',
  height: '500px'
}));
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1)
}));
const ButtonDone = styled(Button)(({ theme }) => ({
  color: theme.palette.green,
  textTransform: 'none',
  fontSize: '18px'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 2, 0.5),
  background: theme.palette.background,
  display: 'flex',
  alignItems: 'center',
  width: '90%',
  borderRadius: '20px'
}));
const InputSearch = styled(InputBase)(() => ({
  width: '90%',
  marginLeft: '5px'
}));
const BoxSuggestion = styled(Box)(() => ({
  height: '300px',
  marginTop: '10px'
}));
TagPeople.prototype = {
  user: PropTypes.object
};
function TagPeople({ user }) {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.post.tags);
  const isOpenTagPeople = useSelector((state) => state.post.isOpenTagPeople);
  useEffect(() => {
    console.log('tags');
    return null;
  }, [user]);
  return (
    <Modal open={isOpenTagPeople} onClose={() => dispatch(actionPostCloseTagPeople())}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => dispatch(actionPostCloseTagPeople())}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="bi:arrow-left" />
          </IconButton>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '100px' }}>
            Tag people
          </Typography>
        </Box>
        <Separate />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BoxSearch>
            <Icon style={{ width: '20px', height: '20px', color: 'grey' }} icon="fe:search" />
            <InputSearch placeholder="Search for friends" />
          </BoxSearch>
          <ButtonDone>Done</ButtonDone>
        </Box>
        <BoxSuggestion>
          <Typography sx={{ color: 'gray', fontSize: '14px' }}>SUGGESTIONS</Typography>
        </BoxSuggestion>
      </BoxModal>
    </Modal>
  );
}

export default TagPeople;
