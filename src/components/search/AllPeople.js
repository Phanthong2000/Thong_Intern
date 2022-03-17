import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionSearchAllPeople } from '../../redux/actions/userAction';
import UserSearch from './UserSearch';

const RootStyle = styled(Box)(() => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}));
AllPeople.prototype = {
  user: PropTypes.object
};
function AllPeople({ user }) {
  const { name } = useParams();
  const searchAllPeople = useSelector((state) => state.user.searchAllPeople);
  const dispatch = useDispatch();
  const [allPeople, setAllPeople] = useState([]);
  useEffect(() => {
    if (user.id !== undefined) dispatch(actionSearchAllPeople(name, user.id));
    return () => null;
  }, [user]);
  useEffect(() => {
    setAllPeople(allPeople);
    return () => null;
  }, [searchAllPeople]);
  if (searchAllPeople.length === 0) return null;
  return (
    <RootStyle>
      {searchAllPeople.map((item, index) => (
        <UserSearch key={index} user={user} searchId={item.id} />
      ))}
    </RootStyle>
  );
}

export default AllPeople;
