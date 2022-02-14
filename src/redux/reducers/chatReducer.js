import { ACTION_CHAT_GET_ALL_CHAT } from '../actions/types';

const defaultState = {
  chatboxs: []
};

const chatReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHAT_GET_ALL_CHAT:
      return {
        ...state,
        chatboxs: action.payload
      };
    default:
      return state;
  }
};
export default chatReducer;
