import {
  ACTION_PAGE_GET_YOUR_PAGES,
  ACTION_PAGE_GET_ALL_PAGES,
  ACTION_PAGE_GET_LIKED_PAGES,
  ACTION_PAGE_MODAL_INVITE,
  ACTION_PAGE_GET_ALL_INVITES
} from '../actions/types';

const defaultState = {
  yourPages: [],
  allPages: [],
  likedPages: [],
  modalInvite: {
    status: false,
    page: {}
  },
  allInvites: []
};

const pageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_PAGE_GET_YOUR_PAGES:
      return {
        ...state,
        yourPages: action.payload
      };
    case ACTION_PAGE_GET_ALL_PAGES:
      return {
        ...state,
        allPages: action.payload
      };
    case ACTION_PAGE_GET_LIKED_PAGES:
      return {
        ...state,
        likedPages: action.payload
      };
    case ACTION_PAGE_MODAL_INVITE:
      return {
        ...state,
        modalInvite: action.payload
      };
    case ACTION_PAGE_GET_ALL_INVITES:
      return {
        ...state,
        allInvites: action.payload
      };
    default:
      return state;
  }
};

export default pageReducer;
