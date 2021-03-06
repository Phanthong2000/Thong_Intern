import {
  ACTION_CHAT_GET_ALL_CHAT,
  ACTION_CHAT_GET_CHATBOX,
  ACTION_CHAT_GET_ALL_MESSAGES_CHATBOX,
  ACTION_CHAT_LOAD_ALL_MESSAGES_CHATBOX_SUCCESS,
  ACTION_CHAT_DELETE_MESSAGE,
  ACTION_CHAT_ADD_IMAGE_MESSAGE,
  ACTION_CHAT_DELETE_IMAGE_MESSAGE,
  ACTION_CHAT_ADD_MESSAGE,
  ACTION_CHAT_CLEAR_IMAGE_MESSAGE,
  ACTION_CHAT_UPDATE_MESSAGE,
  ACTION_CHAT_GET_CHATBOX_HOME,
  ACTION_CHAT_ADD_MESSAGE_CHATBOX_HOME,
  ACTION_CHAT_SEND_REACTION,
  ACTION_CHAT_UPDATE_REACTION_MESSAGE,
  ACTION_CHAT_INPUTTING,
  ACTION_CHAT_GET_CHATGROUP_USER,
  ACTION_CHAT_GET_NEW_CHATBOX_HOME,
  ACTION_CHAT_OPTIONS_CHATBOX,
  ACTION_CHAT_GET_ALL_BADGE_MESSAGE,
  ACTION_CHAT_REPLY_MESSAGE,
  ACTION_CHAT_DELETE_INPUTTING,
  ACTION_CHAT_ADD_INPUTTING
} from '../actions/types';

const defaultState = {
  chatboxs: [],
  chatbox: {
    id: '',
    user: {}
  },
  messages: [],
  isLoadingMessages: false,
  imageMessages: [],
  updateMessage: {
    messageId: '',
    image: ''
  },
  chatboxHome: {
    status: false,
    user: {}
  },
  addMessageChatboxHome: 0,
  sendReaction: 0,
  inputting: [],
  chatgroups: [],
  newChatbox: false,
  optionsChatbox: true,
  badgeMessage: 0,
  reply: {}
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
    case ACTION_CHAT_ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case ACTION_CHAT_ADD_IMAGE_MESSAGE:
      return {
        ...state,
        imageMessages: [...state.imageMessages, action.payload]
      };
    case ACTION_CHAT_UPDATE_MESSAGE:
      return {
        ...state,
        updateMessage: action.payload
      };
    case ACTION_CHAT_UPDATE_REACTION_MESSAGE:
      console.log(action.payload.message);
      return {
        ...state,
        messages: [
          ...state.messages
            .slice(0, action.payload.index)
            .concat([action.payload.message])
            .concat([...state.messages.slice(action.payload.index + 1, state.messages.length)])
        ]
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
    case ACTION_CHAT_CLEAR_IMAGE_MESSAGE:
      return {
        ...state,
        imageMessages: []
      };
    case ACTION_CHAT_GET_CHATBOX_HOME:
      return {
        ...state,
        chatboxHome: action.payload
      };
    case ACTION_CHAT_ADD_MESSAGE_CHATBOX_HOME:
      return {
        ...state,
        addMessageChatboxHome: (state.addMessageChatboxHome += 1)
      };
    case ACTION_CHAT_SEND_REACTION:
      return {
        ...state,
        sendReaction: (state.sendReaction += 1)
      };
    case ACTION_CHAT_INPUTTING:
      return {
        ...state,
        inputting: action.payload
      };
    case ACTION_CHAT_GET_CHATGROUP_USER:
      return {
        ...state,
        chatgroups: action.payload
      };
    case ACTION_CHAT_GET_NEW_CHATBOX_HOME:
      return {
        ...state,
        newChatbox: action.payload
      };
    case ACTION_CHAT_OPTIONS_CHATBOX:
      return {
        ...state,
        optionsChatbox: action.payload
      };
    case ACTION_CHAT_GET_ALL_BADGE_MESSAGE:
      return {
        ...state,
        badgeMessage: action.payload
      };
    case ACTION_CHAT_REPLY_MESSAGE:
      return {
        ...state,
        reply: action.payload
      };
    case ACTION_CHAT_ADD_INPUTTING:
      console.log('inputting', action.payload);
      return {
        ...state,
        inputting: [...state.inputting, action.payload]
      };
    case ACTION_CHAT_DELETE_INPUTTING:
      console.log('delete inputting', action.payload);
      return {
        ...state,
        inputting: state.inputting.filter((input) => input !== action.payload)
      };
    default:
      return state;
  }
};
export default chatReducer;
