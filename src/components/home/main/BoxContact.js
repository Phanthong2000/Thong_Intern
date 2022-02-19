import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'smooth-scrollbar-react';
import Contact from './Contact';

const heightScreen = window.innerHeight;
const RootStyle = styled(Stack)(({ theme }) => ({
  width: '400px',
  height: `${heightScreen - 80.4}px`,
  marginTop: '20px',
  marginRight: '10px',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
const BoxOption = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'space-between',
  height: '30px'
}));
const ButtonOption = styled(Box)(({ theme }) => ({
  width: '30px',
  height: '30px',
  borderRadius: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: '10px',
  ':hover': {
    background: 'lightgray'
  }
}));
BoxContact.prototype = {
  user: PropTypes.object
};
function BoxContact({ user }) {
  const friendManual = useSelector((state) => state.user.friendManual);
  const [quantityFriendManual, setQuantityFriendManual] = useState(-1);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  useEffect(() => {
    setQuantityFriendManual(usersSocket.length);
    return () => null;
  }, [usersSocket, user]);
  const Contacts = () => {
    const BoxContacts = styled(Box)(() => ({
      width: '100%',
      height: `calc(100%-30px)`,
      minHeight: `calc(100% - 30px)`,
      display: 'flex'
    }));
    if (quantityFriendManual === 0) return null;
    return (
      <BoxContacts>
        <Scrollbar alwaysShowTracks>
          {usersSocket.map((item, index) => (
            <Contact user={user} key={index} otherId={item.userId}>
              {item}
            </Contact>
          ))}
        </Scrollbar>
      </BoxContacts>
    );
  };
  return (
    <RootStyle>
      <BoxOption>
        <Typography
          sx={{ color: 'gray', fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}
        >
          Contacts
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonOption>
            <Icon
              style={{ width: '20px', height: '20px', color: 'gray' }}
              icon="bxs:message-square-add"
            />
          </ButtonOption>
          <ButtonOption>
            <Icon
              style={{ width: '20px', height: '20px', color: 'gray' }}
              icon="ant-design:search-outlined"
            />
          </ButtonOption>
        </Box>
      </BoxOption>
      {quantityFriendManual < 0 ? <Icon icon="eos-icons:loading" /> : <Contacts />}
    </RootStyle>
  );
}
export default BoxContact;
