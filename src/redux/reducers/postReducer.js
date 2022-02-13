import {
  ACTION_POST_GET_ALL,
  ACTION_POST_GET_FAIL,
  ACTION_CLOSE_SNACKBAR,
  ACTION_OPEN_SNACKBAR,
  ACTION_POST_CLOSE_CREATE_POST,
  ACTION_POST_OPEN_CREATE_POST,
  ACTION_POST_CLOSE_TAG_PEOPLE,
  ACTION_POST_OPEN_TAG_PEOPLE,
  ACTION_POST_SET_TAGS
} from '../actions/types';

const defaultState = {
  posts: [],
  snackbar: {
    status: false,
    content: '',
    type: ''
  },
  isOpenCreatePost: false,
  isOpenTagPeople: false,
  tags: []
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
    case ACTION_POST_CLOSE_CREATE_POST:
      return {
        ...state,
        isOpenCreatePost: false
      };
    case ACTION_POST_OPEN_CREATE_POST:
      return {
        ...state,
        isOpenCreatePost: true
      };
    case ACTION_POST_OPEN_TAG_PEOPLE:
      return {
        ...state,
        isOpenTagPeople: true
      };
    case ACTION_POST_CLOSE_TAG_PEOPLE:
      return {
        ...state,
        isOpenTagPeople: false
      };
    case ACTION_POST_SET_TAGS:
      return {
        ...state,
        tags: action.payload
      };
    default:
      return state;
  }
};
export default postReducer;
