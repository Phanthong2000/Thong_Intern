import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'smooth-scrollbar-react';
import { getMessaging } from 'firebase/messaging';
import {} from '../../../firebase-config';
import Contact from './Contact';
import Chatgroup from './Chatgroup';

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
  const chatgroups = useSelector((state) => state.chat.chatgroups);
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
            <Contact user={user} key={index} otherId={item.userId} />
          ))}
          <Typography
            sx={{ color: 'gray', fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}
          >
            Group conversations
          </Typography>
          {chatgroups.map((item, index) => (
            <Chatgroup key={index} chatgroup={item} />
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
          <ButtonOption
            onClick={() => {
              const topic = 'highScores';

              const message = {
                data: {
                  score: '850',
                  time: '2:45'
                },
                topic
              };

              // Send a message to devices subscribed to the provided topic.
              getMessaging()
                .send(message)
                .then((response) => {
                  // Response is a message ID string.
                  console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                  console.log('Error sending message:', error);
                });
            }}
          >
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
