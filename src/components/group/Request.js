import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, Skeleton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionGroupUpdate } from '../../redux/actions/groupAction';

const RootStyle = styled(Card)(({ theme }) => ({
  width: '70%',
  marginLeft: '15%',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px'
}));
const ButtonApprove = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'bold',
  color: '#fff',
  fontFamily: 'sans-serif',
  background: theme.palette.green,
  padding: '5px 20px',
  marginRight: '20px',
  ':hover': {
    background: theme.palette.green
  }
}));
const ButtonDecline = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  color: '#000',
  padding: '5px 20px',
  background: 'lightgrey'
}));
Request.prototype = {
  request: PropTypes.object,
  group: PropTypes.object
};
function Request({ request, group }) {
  const [userRequest, setUserRequest] = useState({});
  const dispatch = useDispatch();
  const getUserRequests = () => {
    getDoc(doc(db, 'users', request)).then((snapshot) => {
      setUserRequest({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    if (request !== undefined) getUserRequests();
    return () => null;
  }, []);
  const approve = () => {
    const groupNew = {
      ...group,
      members: [...group.members, request],
      requests: group.requests.filter((item) => item !== request)
    };
    updateDoc(doc(db, 'groups', group.id), groupNew).then((snapshot) => {
      dispatch(actionGroupUpdate());
    });
  };
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {userRequest.id === undefined ? (
          <>
            <Skeleton variant="circular" sx={{ width: '60px', height: '60px' }} />
            <Skeleton variant="text" sx={{ width: '100px', marginLeft: '10px' }} />
          </>
        ) : (
          <>
            <Avatar src={userRequest.avatar} sx={{ width: '60px', height: '60px' }} />
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '16px',
                fontFamily: 'sans-serif',
                marginLeft: '10px'
              }}
            >
              {userRequest.username}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ButtonApprove onClick={approve}>Approve</ButtonApprove>
        <ButtonDecline>Decline</ButtonDecline>
      </Box>
    </RootStyle>
  );
}

export default Request;
