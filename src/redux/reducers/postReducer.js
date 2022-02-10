import { ACTION_POST_GET_ALL, ACTION_POST_GET_FAIL } from '../actions/types';

const defaultState = {
  posts: []
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
    default:
      return state;
  }
};
export default postReducer;
