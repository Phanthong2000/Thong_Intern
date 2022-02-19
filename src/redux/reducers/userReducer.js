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
  ACTION_USER_SCROLL_TOP,
  ACTION_USER_GET_ALL_FRIEND_REQUESTS,
  ACTION_USER_LOADING_GET_ALL_FRIEND_REQUESTS,
  ACTION_USER_DELETE_FRIEND_REQUEST,
  ACTION_USER_GET_ALL_FRIEND_USER_MANUAL,
  TEST_SEARCH,
  ACTION_USER_GET_ALL_FRIEND_OTHER,
  ACTION_USER_BROADCAST_SOCKET
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
  scrollTop: 0,
  friendRequests: [],
  isLoadingFriendRequest: false,
  otherId: '',
  friendManual: [],
  testSearch: '',
  friendsOther: [],
  usersSocket: []
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
    case ACTION_USER_GET_ALL_FRIEND_OTHER:
      return {
        ...state,
        friendsOther: action.payload
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
    case ACTION_USER_GET_ALL_FRIEND_REQUESTS:
      return {
        ...state,
        friendRequests: action.payload
      };
    case ACTION_USER_LOADING_GET_ALL_FRIEND_REQUESTS:
      return {
        ...state,
        isLoadingFriendRequest: true
      };
    case ACTION_USER_DELETE_FRIEND_REQUEST:
      console.log(action.payload);
      return {
        ...state,
        friendRequests: [...state.friendRequests.filter((item) => item.id !== action.payload)]
      };
    case ACTION_USER_GET_ALL_FRIEND_USER_MANUAL:
      return {
        ...state,
        friendManual: action.payload
      };
    case TEST_SEARCH:
      return {
        ...state,
        testSearch: action.payload
      };
    case ACTION_USER_BROADCAST_SOCKET:
      return {
        ...state,
        usersSocket: action.payload
      };
    default:
      return state;
  }
};
export default userReducer;
