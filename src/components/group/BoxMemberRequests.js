import React, { useRef } from 'react';
import { Box, InputBase, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Request from './Request';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 355px)',
  background: '#fff',
  padding: '20px 0px 0px 0px'
}));
const BoxTitle = styled(Box)(() => ({
  width: '70%',
  marginLeft: '15%',
  display: ' flex',
  alignItems: 'center'
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '25px',
  fontFamily: 'sans-serif'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  width: '70%',
  display: 'flex',
  background: theme.palette.background,
  alignItems: 'center',
  marginLeft: '15%',
  padding: '5px 10px',
  borderRadius: '30px',
  marginTop: '30px',
  marginBottom: '20px'
}));
BoxMemberRequests.prototype = {
  user: PropTypes.object,
  group: PropTypes.object
};
function BoxMemberRequests({ user, group }) {
  const BoxRequests = () => {
    const Requests = styled(Box)(({ theme }) => ({
      width: '100%',
      background: theme.palette.background,
      padding: '20px 0px',
      minHeight: `${heightScreen - 210}px`
    }));
    return (
      <Requests>
        {group.requests.map((item, index) => (
          <Request key={index} group={group} request={item} />
        ))}
      </Requests>
    );
  };
  return (
    <RootStyle>
      <BoxTitle>
        <Title>Member requests</Title>
        <Icon icon="ci:dot-02-s" />
        <Title>{group.requests.length}</Title>
      </BoxTitle>
      <BoxSearch>
        <Icon style={{ color: 'gray' }} icon="fluent:search-32-filled" />
        <InputBase sx={{ marginLeft: '5px' }} fullWidth placeholder="Search by name" />
      </BoxSearch>
      <BoxRequests />
    </RootStyle>
  );
}

export default BoxMemberRequests;
