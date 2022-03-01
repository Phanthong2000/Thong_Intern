import React, { useEffect, useState } from 'react';
import { Avatar, Box, IconButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  marginTop: '5px',
  justifyContent: 'space-between'
}));
Member.prototype = {
  memberId: PropTypes.object,
  user: PropTypes.object,
  userId: PropTypes.string
};
function Member({ user, memberId, userId }) {
  const [userMember, setUserMember] = useState({});
  useEffect(() => {
    getDoc(doc(db, 'users', memberId)).then((snapshot) => {
      setUserMember({
        ...snapshot.data(),
        id: memberId
      });
    });
    return () => null;
  }, []);
  return (
    <RootStyle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={userMember.avatar} />
        <Box sx={{ marginLeft: '5px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
            {userMember.username}
          </Typography>
          {memberId === userId && (
            <Typography sx={{ color: 'gray', fontSize: '12px' }}>Admin</Typography>
          )}
        </Box>
      </Box>
      <IconButton>
        <Icon icon="bi:three-dots" />
      </IconButton>
    </RootStyle>
  );
}

export default Member;
