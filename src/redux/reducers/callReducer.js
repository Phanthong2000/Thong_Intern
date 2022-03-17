import {
  ME,
  CALL,
  STREAM,
  CALL_ACCEPTED,
  CALL_ENDED,
  NAME,
  REMOTE_STREAM,
  CONNECTION,
  MODAL_RECEIVING
} from '../actions/types';

const defaultState = {
  me: '',
  name: 'Phan Thong',
  call: {},
  stream: null,
  remoteStream: null,
  callAccepted: false,
  callEnded: false,
  connection: null,
  modalReceiving: false
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
    default:
      return state;
  }
};
export default callReducer;
