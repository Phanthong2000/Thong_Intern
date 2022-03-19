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
  CALL_ENDED_GROUP
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
  callEndedGroup: false
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
    default:
      return state;
  }
};
export default callReducer;
