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
  VIDEO,
  AUDIO,
  VIDEO_OTHER,
  AUDIO_OTHER,
  START_COUNT,
  GROUP,
  LOCAL_STREAM_GROUP,
  MODAL_RECEIVING_GROUP,
  REMOTE_STREAM_GROUP,
  CALL_GROUP,
  CALL_ACCEPTED_GROUP,
  SOCKETIDS_GROUP,
  ADD_REMOTE_STREAM_GROUP,
  ADD_SIGNAL_GROUP,
  SIGNAL_GROUP,
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
} from '../actions/types';

const defaultState = {
  me: '',
  name: '',
  call: {},
  stream: null,
  remoteStream: null,
  callAccepted: false,
  callEnded: false,
  connection: null,
  modalReceiving: false,
  audio: true,
  video: true,
  audioOther: true,
  videoOther: true,
  startCount: false,
  group: {},
  localStreamGroup: null,
  modalReceivingGroup: false,
  remoteStreamGroup: [],
  callGroup: {},
  callAcceptedGroup: false,
  socketIds: [],
  signalGroup: [],
  allMembers: [],
  participants: {},
  callEndedGroup: false,
  socket: {},
  modalAddMemberToRoom: {
    status: false,
    room: {}
  },
  allPeers: [],
  modalInviteJoinRoom: {
    status: false,
    name: ''
  },
  socketIdsJoinRoom: [],
  modalReceiveInviteJoinRoom: {
    status: false,
    name: '',
    roomId: ''
  },
  chooseParticipant: {}
};

const callReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ME:
      return {
        ...state,
        me: action.payload
      };
    case NAME:
      return {
        ...state,
        name: action.payload
      };
    case CALL:
      return {
        ...state,
        call: action.payload
      };
    case CALL_ACCEPTED:
      return {
        ...state,
        callAccepted: action.payload
      };
    case CALL_ENDED:
      return {
        ...state,
        callEnded: action.payload
      };
    case STREAM:
      console.log('stream', action.payload);
      return {
        ...state,
        stream: action.payload
      };
    case REMOTE_STREAM:
      console.log('remote', action.payload);
      return {
        ...state,
        remoteStream: action.payload
      };
    case CONNECTION:
      return {
        ...state,
        connection: action.payload
      };
    case MODAL_RECEIVING:
      return {
        ...state,
        modalReceiving: action.payload
      };
    case AUDIO:
      return {
        ...state,
        audio: action.payload
      };
    case VIDEO:
      return {
        ...state,
        video: action.payload
      };
    case AUDIO_OTHER:
      return {
        ...state,
        audioOther: action.payload
      };
    case VIDEO_OTHER:
      return {
        ...state,
        videoOther: action.payload
      };
    case START_COUNT:
      return {
        ...state,
        startCount: action.payload
      };
    case GROUP:
      return {
        ...state,
        group: action.payload
      };
    case LOCAL_STREAM_GROUP:
      return {
        ...state,
        localStreamGroup: action.payload
      };
    case MODAL_RECEIVING_GROUP:
      return {
        ...state,
        modalReceivingGroup: action.payload
      };
    case REMOTE_STREAM_GROUP:
      return {
        ...state,
        remoteStreamGroup: action.payload
      };
    case CALL_GROUP:
      return {
        ...state,
        callGroup: action.payload
      };
    case CALL_ACCEPTED_GROUP:
      return {
        ...state,
        callAcceptedGroup: action.payload
      };
    case SOCKETIDS_GROUP:
      return {
        ...state,
        socketIds: action.payload
      };

    case ADD_REMOTE_STREAM_GROUP:
      console.log(action.payload);
      return {
        ...state,
        remoteStreamGroup: [...state.remoteStreamGroup, action.payload]
      };
    case SIGNAL_GROUP:
      return {
        ...state,
        signalGroup: action.payload
      };
    case ADD_SIGNAL_GROUP:
      return {
        ...state,
        signalGroup: [...state.signalGroup, action.payload]
      };
    case ALL_MEMBERS_GROUP:
      return {
        ...state,
        allMembers: action.payload
      };
    case PARTICIPANTS:
      return {
        ...state,
        participants: action.payload
      };
    case CALL_ENDED_GROUP:
      return {
        ...state,
        callEndedGroup: action.payload
      };
    case SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    case MODAL_ADD_USER_TO_ROOM:
      return {
        ...state,
        modalAddMemberToRoom: action.payload
      };
    case SET_PEERS:
      console.log('set peers', action.payload);
      return {
        ...state,
        allPeers: action.payload
      };
    case ADD_PEERS:
      return {
        ...state,
        allPeers: [...state.allPeers, action.payload]
      };
    case DELETE_PEERS:
      return {
        ...state,
        allPeers: state.allPeers.filter((peer) => peer !== action.payload)
      };
    case MODAL_INVITE_JOIN_ROOM:
      return {
        ...state,
        modalInviteJoinRoom: action.payload
      };
    case ADD_SOCKETIDS_INVITE_JOIN_ROOM:
      console.log(action.payload);
      return {
        ...state,
        socketIdsJoinRoom: [...state.socketIdsJoinRoom, action.payload]
      };
    case DELETE_SOCKETIDS_INVITE_JOIN_ROOM:
      return {
        ...state,
        socketIdsJoinRoom: state.socketIdsJoinRoom.filter((socketId) => socketId !== action.payload)
      };
    case SET_SOCKETIDS_INVITE_JOIN_ROOM:
      return {
        ...state,
        socketIdsJoinRoom: action.payload
      };
    case MODAL_RECEIVE_INVITE_JOIN_ROOM:
      return {
        ...state,
        modalReceiveInviteJoinRoom: action.payload
      };
    case CHOOSE_PARTICIPANT:
      return {
        ...state,
        chooseParticipant: action.payload
      };
    default:
      return state;
  }
};
export default callReducer;
