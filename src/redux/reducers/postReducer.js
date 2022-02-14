import {
  ACTION_POST_GET_ALL,
  ACTION_POST_GET_FAIL,
  ACTION_CLOSE_SNACKBAR,
  ACTION_OPEN_SNACKBAR,
  ACTION_POST_CLOSE_CREATE_POST,
  ACTION_POST_OPEN_CREATE_POST,
  ACTION_POST_CLOSE_TAG_PEOPLE,
  ACTION_POST_OPEN_TAG_PEOPLE,
  ACTION_POST_CLEAR_TAGS,
  ACTION_POST_ADD_TAG,
  ACTION_POST_REMOVE_TAG,
  ACTION_POST_CLOSE_CONFIRM_DELETE_POST,
  ACTION_POST_OPEN_CONFIRM_DELETE_POST
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
  tags: [],
  isOpenConfirmDeletePost: {
    status: false,
    postId: ''
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
    case ACTION_POST_CLEAR_TAGS:
      return {
        ...state,
        tags: []
      };
    case ACTION_POST_ADD_TAG:
      return {
        ...state,
        tags: [...state.tags, action.payload]
      };
    case ACTION_POST_REMOVE_TAG:
      return {
        ...state,
        tags: [
          ...state.tags
            .slice(0, action.payload)
            .concat(...state.tags.slice(action.payload + 1, state.tags.length))
        ]
      };
    case ACTION_POST_OPEN_CONFIRM_DELETE_POST:
      return {
        ...state,
        isOpenConfirmDeletePost: {
          status: true,
          postId: action.payload
        }
      };
    case ACTION_POST_CLOSE_CONFIRM_DELETE_POST:
      return {
        ...state,
        isOpenConfirmDeletePost: {
          status: false,
          postId: ''
        }
      };
    default:
      return state;
  }
};
export default postReducer;
