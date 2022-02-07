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
  ACTION_USER_OPEN_REQUESTS
} from '../actions/types';

const defaultState = {
  isLoggedIn: !!localStorage.getItem('user'),
  isSearching: false,
  isOpeningProfile: false,
  isOpeningNotifications: false,
  isOpeningRequests: false
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
    default:
      return state;
  }
};
export default userReducer;
