import {
  ME,
  CALL,
  STREAM,
  CALL_ACCEPTED,
  CALL_ENDED,
  NAME,
  REMOTE_STREAM,
  CONNECTION,
  MODAL_RECEIVING,
  AUDIO,
  VIDEO,
  AUDIO_OTHER,
  VIDEO_OTHER,
  START_COUNT,
  GROUP,
  LOCAL_STREAM_GROUP,
  REMOTE_STREAM_GROUP,
  MODAL_RECEIVING_GROUP,
  CALL_ACCEPTED_GROUP,
  CALL_GROUP,
  SOCKETIDS_GROUP,
  ADD_REMOTE_STREAM_GROUP,
  SIGNAL_GROUP,
  ADD_SIGNAL_GROUP,
  ALL_MEMBERS_GROUP,
  PARTICIPANTS,
  CALL_ENDED_GROUP,
  SOCKET,
  MODAL_ADD_USER_TO_ROOM,
  ADD_PEERS,
  DELETE_PEERS,
  SET_PEERS,
  MODAL_INVITE_JOIN_ROOM,
  ADD_SOCKETIDS_INVITE_JOIN_ROOM,
  DELETE_SOCKETIDS_INVITE_JOIN_ROOM,
  SET_SOCKETIDS_INVITE_JOIN_ROOM,
  MODAL_RECEIVE_INVITE_JOIN_ROOM,
  CHOOSE_PARTICIPANT
} from './types';

export const actionMe = (data) => ({
  type: ME,
  payload: data
});
export const actionCall = (data) => ({
  type: CALL,
  payload: data
});
export const actionCallAccepted = (data) => ({
  type: CALL_ACCEPTED,
  payload: data
});
export const actionCallEnded = (data) => ({
  type: CALL_ENDED,
  payload: data
});
export const actionStream = (data) => ({
  type: STREAM,
  payload: data
});
export const actionName = (data) => ({
  type: NAME,
  payload: data
});
export const actionRemoteStream = (data) => ({
  type: REMOTE_STREAM,
  payload: data
});
export const actionConnection = (data) => ({
  type: CONNECTION,
  payload: data
});
export const actionModalReceiving = (data) => ({
  type: MODAL_RECEIVING,
  payload: data
});
export const actionAudio = (data) => ({
  type: AUDIO,
  payload: data
});
export const actionVideo = (data) => ({
  type: VIDEO,
  payload: data
});
export const actionAudioOther = (data) => ({
  type: AUDIO_OTHER,
  payload: data
});
export const actionVideoOther = (data) => ({
  type: VIDEO_OTHER,
  payload: data
});
export const actionStartCount = (data) => ({
  type: START_COUNT,
  payload: data
});

export const actionGroup = (data) => ({
  type: GROUP,
  payload: data
});
export const actionLocalStreamGroup = (data) => ({
  type: LOCAL_STREAM_GROUP,
  payload: data
});
export const actionRemoteStreamGroup = (data) => ({
  type: REMOTE_STREAM_GROUP,
  payload: data
});
export const actionModalReceivingGroup = (data) => ({
  type: MODAL_RECEIVING_GROUP,
  payload: data
});
export const actionCallAcceptedGroup = (data) => ({
  type: CALL_ACCEPTED_GROUP,
  payload: data
});
export const actionCallGroup = (data) => ({
  type: CALL_GROUP,
  payload: data
});
export const actionSocketIdsGroup = (data) => ({
  type: SOCKETIDS_GROUP,
  payload: data
});
export const actionAddRemoteStreamGroup = (data) => ({
  type: ADD_REMOTE_STREAM_GROUP,
  payload: data
});

export const actionSignalGroup = (data) => ({
  type: SIGNAL_GROUP,
  payload: data
});

export const actionAddSignalGroup = (data) => ({
  type: ADD_SIGNAL_GROUP,
  payload: data
});
export const actionAllMembersGroup = (data) => ({
  type: ALL_MEMBERS_GROUP,
  payload: data
});
export const actionParticipants = (data) => ({
  type: PARTICIPANTS,
  payload: data
});

export const actionCallEndedGroup = (data) => ({
  type: CALL_ENDED_GROUP,
  payload: data
});
export const actionSocket = (data) => ({
  type: SOCKET,
  payload: data
});
export const actionModalAddMemberToRoom = (data) => ({
  type: MODAL_ADD_USER_TO_ROOM,
  payload: data
});
export const actionSetPeers = (data) => ({
  type: SET_PEERS,
  payload: data
});
export const actionAddPeers = (data) => ({
  type: ADD_PEERS,
  payload: data
});
export const actionDeletePeers = (data) => ({
  type: DELETE_PEERS,
  payload: data
});
export const actionModalInviteJoinRoom = (data) => ({
  type: MODAL_INVITE_JOIN_ROOM,
  payload: data
});
export const actionAddSocketIdsJoinRoom = (data) => ({
  type: ADD_SOCKETIDS_INVITE_JOIN_ROOM,
  payload: data
});
export const actionDeleteSocketIdsJoinRoom = (data) => ({
  type: DELETE_SOCKETIDS_INVITE_JOIN_ROOM,
  payload: data
});

export const actionSetSocketIdsJoinRoom = (data) => ({
  type: SET_SOCKETIDS_INVITE_JOIN_ROOM,
  payload: data
});
export const actionModalReceiveInviteJoinRoom = (data) => ({
  type: MODAL_RECEIVE_INVITE_JOIN_ROOM,
  payload: data
});
export const actionChooseParticipant = (data) => ({
  type: CHOOSE_PARTICIPANT,
  payload: data
});
