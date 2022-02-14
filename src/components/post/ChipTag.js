import React from 'react';
import { Box, Grid, IconButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { actionPostRemoveTag } from '../../redux/actions/postAction';

const RootStyle = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1, 0.5)
}));
const BoxChip = styled(Box)(({ theme }) => ({
  background: theme.palette.background,
  color: theme.palette.green,
  padding: theme.spacing(0.5, 1, 0.5),
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '5px',
  justifyContent: 'space-between'
}));
ChipTag.prototype = {
  tag: PropTypes.object
};
function ChipTag({ tag, index }) {
  const dispatch = useDispatch();
  const removeTag = () => {
    dispatch(actionPostRemoveTag(index));
  };
  return (
    <RootStyle item xs={4} sm={4} md={4} lg={4} xl={4}>
      <BoxChip>
        <Typography sx={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'inherit' }}>
          {tag.username}
        </Typography>
        <Icon
          onClick={removeTag}
          style={{
            color: '#30ab78',
            cursor: 'pointer'
          }}
          icon="bi:x-circle"
        />
      </BoxChip>
    </RootStyle>
  );
}

export default ChipTag;
