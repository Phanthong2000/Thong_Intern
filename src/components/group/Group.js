import { Box, Card, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import BoxAvatarGroup from './BoxAvatarGroup';
import { db } from '../../firebase-config';
import BoxAdmin from './BoxAdmin';
import BoxOverview from './BoxOverview';
import BoxMemberRequests from './BoxMemberRequests';
import { actionGetGroupsYouJoined, actionGetAllGroups } from '../../redux/actions/groupAction';
import ModalInvite from './ModalInvite';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `${heightScreen - 60}px`,
  background: theme.palette.background,
  marginTop: '60px',
  display: 'flex',
  justifyContent: 'space-between'
}));
Group.prototype = {
  user: PropTypes.object
};
function Group({ user }) {
  const socket = useSelector((state) => state.call.socket);
  const socketRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  const modalInvite = useSelector((state) => state.group.modalInvite);
  const [hidden, setHidden] = useState(false);
  const [option, setOption] = useState('home');
  const [group, setGroup] = useState({});
  const update = useSelector((state) => state.group.update);
  const getGroup = () => {
    getDoc(doc(db, 'groups', id)).then((snapshot) => {
      setGroup({
        ...snapshot.data(),
        id: snapshot.id
      });
    });
  };
  useEffect(() => {
    getGroup();
    if (socket.id !== undefined) {
      socketRef.current = socket;
      socketRef.current.on(`join group private`, (data) => {
        if (data.group.id === id) getGroup();
      });
      socketRef.current.on(`cancel request`, (data) => {
        if (data.group.id === id) getGroup();
      });
      socketRef.current.on('answer request', (data) => {
        if (data.group.id === id) {
          getGroup();
        }
      });
    }
    return () => null;
  }, [user, update]);
  if (group.id === undefined) return null;
  return (
    <RootStyle>
      {group.userCreate === user.id && !hidden && (
        <BoxAdmin
          home={() => setOption('home')}
          overview={() => setOption('overview')}
          requests={() => setOption('requests')}
          option={option}
          user={user}
          group={group}
          hidden={() => setHidden(true)}
        />
      )}
      {option === 'home' && (
        <BoxAvatarGroup
          group={group}
          getGroup={() => getGroup()}
          show={() => setHidden(false)}
          hidden={hidden}
          user={user}
        />
      )}
      {option === 'overview' && <BoxOverview />}
      {option === 'requests' && <BoxMemberRequests user={user} group={group} />}
      {modalInvite.status && <ModalInvite />}
    </RootStyle>
  );
}

export default Group;
