import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/material';
import { actionSearchAll } from '../../redux/actions/userAction';
import PageSearch from './PageSearch';
import GroupSearch from './GroupSearch';
import UserSearch from './UserSearch';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%'
}));
All.prototype = {
  user: PropTypes.object
};
function All({ user }) {
  const [all, setAll] = useState([]);
  const searchAll = useSelector((state) => state.user.searchAll);
  useEffect(() => {
    setAll(searchAll);
    return () => null;
  }, [searchAll]);
  if (searchAll.length === 0) return null;
  return (
    <RootStyle>
      {all.map((item, index) => {
        if (item.type === 'page') return <PageSearch key={index} page={item} user={user} />;
        if (item.type === 'group') return <GroupSearch key={index} group={item} user={user} />;
        if (item.type === 'user') return <UserSearch key={index} userSearch={item} user={user} />;
        return null;
      })}
    </RootStyle>
  );
}

export default All;
