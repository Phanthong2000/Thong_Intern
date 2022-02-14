import {
  ACTION_USER_CLOSE_SEARCH,
  ACTION_USER_OPEN_SEARCH,
  ACTION_USER_CLOSE_PROFILE,
  ACTION_USER_OPEN_PROFILE,
  ACTION_USER_LOGIN,
  ACTION_USER_LOGOUT,
  ACTION_USER_CLOSE_NOTIFICATIONS,
  ACTION_USER_CLOSE_REQUESTS,
  ACTION_USER_OPEN_NOTIFICATIONS,
  ACTION_USER_OPEN_REQUESTS,
  ACTION_USER_CLOSE_LOADING_UPDATE_PROFILE,
  ACTION_USER_OPEN_LOADING_UPDATE_PROFILE,
  ACTION_USER_CONTACT_USER_AND_OTHER,
  ACTION_USER_GET_ALL_FRIEND_USER,
  ACTION_USER_GET_USER_SEARCH,
  ACTION_USER_SCROLL_TOP
} from '../actions/types';

const defaultState = {
  isLoggedIn: !!localStorage.getItem('user'),
  isSearching: false,
  isOpeningProfile: false,
  isOpeningNotifications: false,
  isOpeningRequests: false,
  isLoadingUpdateProfile: false,
  contact: {
    id: '',
    status: ''
  },
  friends: [],
  search: [],
  scrollTop: 0
};
const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_USER_OPEN_SEARCH:
      return {
        ...state,
        isSearching: true,
        isOpeningProfile: false,
        isOpeningNotifications: false,
        isOpeningRequests: false
      };
    case ACTION_USER_CLOSE_SEARCH:
      return {
        ...state,
        isSearching: false,
        isOpeningProfile: false,
        isOpeningNotifications: false,
        isOpeningRequests: false
      };
    case ACTION_USER_CLOSE_PROFILE:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false
      };
    case ACTION_USER_OPEN_PROFILE:
      return {
        ...state,
        isOpeningProfile: true,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false
      };
    case ACTION_USER_OPEN_NOTIFICATIONS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: true,
        isOpeningRequests: false
      };
    case ACTION_USER_CLOSE_NOTIFICATIONS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false
      };
    case ACTION_USER_OPEN_REQUESTS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: true
      };
    case ACTION_USER_CLOSE_REQUESTS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false
      };
    case ACTION_USER_LOGIN:
      return {
        ...state,
        isLoggedIn: true
      };
    case ACTION_USER_LOGOUT:
      return {
        ...state,
        isLoggedIn: false
      };
    case ACTION_USER_OPEN_LOADING_UPDATE_PROFILE:
      return {
        ...state,
        isLoadingUpdateProfile: true
      };
    case ACTION_USER_CLOSE_LOADING_UPDATE_PROFILE:
      return {
        ...state,
        isLoadingUpdateProfile: false
      };
    case ACTION_USER_CONTACT_USER_AND_OTHER:
      return {
        ...state,
        contact: {
          id: action.payload.id,
          status: action.payload.status
        }
      };
    case ACTION_USER_GET_ALL_FRIEND_USER:
      return {
        ...state,
        friends: action.payload
      };
    case ACTION_USER_GET_USER_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case ACTION_USER_SCROLL_TOP:
      return {
        ...state,
        scrollTop: state.scrollTop + 1
      };
    default:
      return state;
  }
};
export default userReducer;
