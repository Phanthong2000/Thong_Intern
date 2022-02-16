import {
  ACTION_CHAT_GET_ALL_CHAT,
  ACTION_CHAT_GET_CHATBOX,
  ACTION_CHAT_GET_ALL_MESSAGES_CHATBOX,
  ACTION_CHAT_LOAD_ALL_MESSAGES_CHATBOX_SUCCESS,
  ACTION_CHAT_DELETE_MESSAGE,
  ACTION_CHAT_ADD_IMAGE_MESSAGE,
  ACTION_CHAT_DELETE_IMAGE_MESSAGE
} from '../actions/types';

const defaultState = {
  chatboxs: [],
  chatbox: {
    id: '',
    user: {}
  },
  messages: [],
  isLoadingMessages: false,
  imageMessages: []
};

const chatReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHAT_GET_ALL_CHAT:
      return {
        ...state,
        chatboxs: action.payload
      };
    case ACTION_CHAT_GET_CHATBOX:
      return {
        ...state,
        chatbox: action.payload
      };
    case ACTION_CHAT_GET_ALL_MESSAGES_CHATBOX:
      return {
        ...state,
        messages: action.payload
      };
    case ACTION_CHAT_LOAD_ALL_MESSAGES_CHATBOX_SUCCESS:
      return {
        ...state,
        isLoadingMessages: true
      };
    case ACTION_CHAT_DELETE_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages
            .slice(0, action.payload)
            .concat(...state.messages.slice(action.payload + 1, state.messages.length))
        ]
      };
    case ACTION_CHAT_ADD_IMAGE_MESSAGE:
      return {
        ...state,
        imageMessages: [...state.imageMessages, action.payload]
      };
    case ACTION_CHAT_DELETE_IMAGE_MESSAGE:
      return {
        ...state,
        imageMessages: [
          ...state.imageMessages
            .slice(0, action.payload)
            .concat(...state.imageMessages.slice(action.payload + 1, state.imageMessages.length))
        ]
      };
    default:
      return state;
  }
};
export default chatReducer;
