import { keyframes } from '@emotion/react';
import { Icon } from '@iconify/react';
import { Box, Card, IconButton, Modal, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { joinGroup } from '../../utils/wssConnection';
import {
  actionGroup,
  actionLocalStreamGroup,
  actionModalReceivingGroup,
  actionParticipants
} from '../../redux/actions/callAction';

const anim = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.375;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;
const RootStyle = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '300px',
  height: '300px',
  textAlign: 'center',
  background: theme.palette.green,
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
ModalReceivingGroup.prototype = {
  user: PropTypes.object
};
function ModalReceivingGroup({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalReceivingGroup = useSelector((state) => state.call.modalReceivingGroup);
  const group = useSelector((state) => state.call.group);
  const me = useSelector((state) => state.call.me);
  const callGroup = useSelector((state) => state.call.callGroup);
  const participants = useSelector((state) => state.call.participants);
  const answerGroup = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        dispatch(actionLocalStreamGroup(currentStream));
      })
      .then(() => {
        dispatch(actionModalReceivingGroup(false));
        const memberNew = [...group.members, { userId: user.id, socketId: me }];
        dispatch(
          actionParticipants({
            ...participants,
            members: memberNew
          })
        );
        dispatch(
          actionGroup({
            ...group,
            members: memberNew
          })
        );
        joinGroup(user.id);
        // answerCallGroup();
        navigate(`/home/room/${group.id}`);
      });
  };
  return (
    <Modal open={modalReceivingGroup} onClose={() => dispatch(actionModalReceivingGroup(false))}>
      <RootStyle>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '20px' }}>
            Video call group is calling
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <IconButton
              sx={{
                border: `1px solid green`,
                width: '70px',
                height: '70px',
                animation: `${anim} 3s ease forwards infinite`
              }}
            >
              <Icon
                style={{ color: '#fff', width: '40px', height: '40px' }}
                icon="bi:phone-vibrate-fill"
              />
            </IconButton>
          </Box>
          <Stack
            direction="row"
            sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
          >
            <IconButton
              onClick={answerGroup}
              sx={{ color: 'lightgreen', width: '50px', height: '50px', background: '#fff' }}
            >
              <Icon icon="icomoon-free:phone" />
            </IconButton>
            <IconButton sx={{ color: 'red', width: '50px', height: '50px', background: '#fff' }}>
              <Icon icon="icomoon-free:phone-hang-up" />
            </IconButton>
          </Stack>
        </Box>
      </RootStyle>
    </Modal>
  );
}

export default ModalReceivingGroup;
