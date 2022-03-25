import {
  ACTION_GROUP_GET_GROUPS_YOU_MANAGE,
  ACTION_GROUP_GET_GROUPS_YOU_JOINED,
  ACTION_GROUP_MODAL_CREATE_POST,
  ACTION_GROUP_UPDATE,
  ACTION_GROUP_GET_POSTS_ALL_GROUP,
  ACTION_GROUP_GET_ALL_GROUPS
} from '../actions/types';

const defaultState = {
  groupsYouManage: [],
  groupsYouJoined: [],
  modalCreatePostGroup: {
    status: false,
    group: {}
  },
  update: 0,
  postsAllGroup: [],
  allGroups: []
};

const groupReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_GROUP_GET_GROUPS_YOU_MANAGE:
      return {
        ...state,
        groupsYouManage: action.payload
      };
    case ACTION_GROUP_GET_GROUPS_YOU_JOINED:
      return {
        ...state,
        groupsYouJoined: action.payload
      };
    case ACTION_GROUP_MODAL_CREATE_POST:
      return {
        ...state,
        modalCreatePostGroup: action.payload
      };
    case ACTION_GROUP_UPDATE:
      return {
        ...state,
        update: state.update + 1
      };
    case ACTION_GROUP_GET_POSTS_ALL_GROUP:
      return {
        ...state,
        postsAllGroup: action.payload
      };
    case ACTION_GROUP_GET_ALL_GROUPS:
      return {
        ...state,
        allGroups: action.payload
      };
    default:
      return state;
  }
};
export default groupReducer;
