import {
  ACTION_POST_GET_ALL,
  ACTION_POST_GET_FAIL,
  ACTION_CLOSE_SNACKBAR,
  ACTION_OPEN_SNACKBAR
} from '../actions/types';

const defaultState = {
  posts: [],
  snackbar: {
    status: false,
    content: '',
    type: ''
  }
};
const postReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_POST_GET_ALL:
      return {
        ...state,
        posts: action.payload
      };
    case ACTION_POST_GET_FAIL:
      return {
        ...state,
        posts: action.payload
      };
    case ACTION_CLOSE_SNACKBAR:
      return {
        ...state,
        snackbar: {
          status: false,
          content: '',
          type: ''
        }
      };
    case ACTION_OPEN_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...action.payload
        }
      };
    default:
      return state;
  }
};
export default postReducer;
