import { Box, styled } from '@mui/material';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionSearchAllPeople,
  actionSearchAllFriends,
  actionSearchAllSent,
  actionSearchAllFriendRequests
} from '../../redux/actions/userAction';
import UserSearch from './UserSearch';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}));
AllRequests.prototype = {
  user: PropTypes.object
};
function AllRequests({ user }) {
  const { name } = useParams();
  const searchAllRequests = useSelector((state) => state.user.searchAllRequests);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.id !== undefined) dispatch(actionSearchAllFriendRequests(name, user.id));
    return () => null;
  }, [user, name]);
  if (searchAllRequests.length === 0) return null;
  return (
    <RootStyle>
      {searchAllRequests.map((item, index) => (
        <UserSearch key={index} user={user} searchId={item.id} />
      ))}
    </RootStyle>
  );
}

export default AllRequests;
