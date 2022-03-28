import { Box, styled } from '@mui/material';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionSearchAllPeople,
  actionSearchAllFriends,
  actionSearchAllSent
} from '../../redux/actions/userAction';
import UserSearch from './UserSearch';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}));
AllSent.prototype = {
  user: PropTypes.object
};
function AllSent({ user }) {
  const { name } = useParams();
  const searchAllSent = useSelector((state) => state.user.searchAllSent);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.id !== undefined) dispatch(actionSearchAllSent(name, user.id));
    return () => null;
  }, [user, name]);
  if (searchAllSent.length === 0) return null;
  return (
    <RootStyle>
      {searchAllSent.map((item, index) => (
        <UserSearch key={index} user={user} searchId={item.id} />
      ))}
    </RootStyle>
  );
}

export default AllSent;
