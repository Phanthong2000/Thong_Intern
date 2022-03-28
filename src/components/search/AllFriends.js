import { Box, styled } from '@mui/material';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionSearchAllPeople, actionSearchAllFriends } from '../../redux/actions/userAction';
import UserSearch from './UserSearch';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}));
AllFriends.prototype = {
  user: PropTypes.object
};
function AllFriends({ user }) {
  const { name } = useParams();
  const searchAllFriends = useSelector((state) => state.user.searchAllFriends);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.id !== undefined) dispatch(actionSearchAllFriends(name, user.id));
    return () => null;
  }, [user, name]);
  if (searchAllFriends.length === 0) return null;
  return (
    <RootStyle>
      {searchAllFriends.map((item, index) => (
        <UserSearch key={index} user={user} searchId={item.id} />
      ))}
    </RootStyle>
  );
}

export default AllFriends;
