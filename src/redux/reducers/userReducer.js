import {
  ACTION_USER_GET_USER,
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
  ACTION_USER_BROADCAST_SOCKET,
  ACTION_USER_OPEN_MESSENGER,
  ACTION_USER_CLOSE_MESSENGER,
  ACTION_USER_OPEN_EDIT_DETAIL,
  ACTION_USER_ADD_FRIEND_REQUEST,
  ACTION_USER_GET_ALL_NOTIFICATIONS,
  ACTION_USER_GET_BADGE_NOTIFICATION,
  ACTION_USER_HOVER_USERNAME,
  ACTION_USER_SEARCH_ALL_FRIEND,
  ACTION_USER_SEARCH_ALL_PEOPLE,
  ACTION_USER_SEARCH_ALL_REQUESTS,
  ACTION_USER_SEARCH_ALL_SENT,
  ACTION_USER_SEARCH_OTHERS,
  ACTION_USER_GET_ALL_STORY_USER,
  ACTION_USER_GET_STORY_USER,
  ACTION_USER_GET_FRIENDS_HAVE_STORY,
  ACTION_USER_GET_TOKEN_MESSAGING,
  ACTION_USER_DELETE_FRIEND_USER,
  ACTION_USER_HOT_TOAST,
  ACTION_USER_BACKDROP
} from '../actions/types';

const defaultState = {
  isLoggedIn: !!localStorage.getItem('user'),
  user: {},
  isSearching: false,
  isMessenger: false,
  isOpeningProfile: false,
  isOpeningNotifications: false,
  isOpeningRequests: false,
  isLoadingUpdateProfile: false,
  isEditDetail: false,
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
  usersSocket: [],
  notifications: [],
  badgeNotification: 0,
  userHoverUsername: {},
  searchAllPeople: [],
  searchAllFriends: [],
  searchAllSent: [],
  searchAllRequests: [],
  searchOthers: [],
  allStories: {
    user: '',
    stories: []
  },
  stories: [],
  friendsHaveStory: [],
  tokenMessaging: '',
  hotToast: '',
  backdrop: {
    status: false,
    content: ''
  }
};
const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_USER_GET_USER:
      return {
        ...state,
        user: action.payload
      };
    case ACTION_USER_OPEN_SEARCH:
      return {
        ...state,
        isSearching: true,
        isOpeningProfile: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_CLOSE_SEARCH:
      return {
        ...state,
        isSearching: false,
        isOpeningProfile: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_CLOSE_PROFILE:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_OPEN_PROFILE:
      return {
        ...state,
        isOpeningProfile: true,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_OPEN_NOTIFICATIONS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: true,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_CLOSE_NOTIFICATIONS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_OPEN_REQUESTS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: true,
        isMessenger: false
      };
    case ACTION_USER_CLOSE_REQUESTS:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_CLOSE_MESSENGER:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: false
      };
    case ACTION_USER_OPEN_MESSENGER:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false,
        isOpeningNotifications: false,
        isOpeningRequests: false,
        isMessenger: true
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
    case ACTION_USER_DELETE_FRIEND_USER:
      return {
        ...state,
        friends: [
          ...state.friends
            .slice(0, action.payload)
            .concat(...state.friends.slice(action.payload + 1, state.friends.length))
        ]
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
      return {
        ...state,
        friendRequests: [...state.friendRequests.filter((item) => item.id !== action.payload)]
      };
    case ACTION_USER_ADD_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: [...state.friendRequests, action.payload]
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
    case ACTION_USER_OPEN_EDIT_DETAIL:
      return {
        ...state,
        isEditDetail: action.payload
      };
    case ACTION_USER_GET_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      };
    case ACTION_USER_GET_BADGE_NOTIFICATION:
      return {
        ...state,
        badgeNotification: action.payload
      };
    case ACTION_USER_HOVER_USERNAME:
      return {
        ...state,
        userHoverUsername: action.payload
      };
    case ACTION_USER_SEARCH_ALL_PEOPLE:
      return {
        ...state,
        searchAllPeople: action.payload
      };
    case ACTION_USER_SEARCH_ALL_FRIEND:
      return {
        ...state,
        searchAllFriends: action.payload
      };
    case ACTION_USER_SEARCH_ALL_SENT:
      return {
        ...state,
        searchAllSent: action.payload
      };
    case ACTION_USER_SEARCH_ALL_REQUESTS:
      return {
        ...state,
        searchAllRequests: action.payload
      };
    case ACTION_USER_SEARCH_OTHERS:
      return {
        ...state,
        searchOthers: action.payload
      };
    case ACTION_USER_GET_ALL_STORY_USER:
      return {
        ...state,
        allStories: action.payload
      };
    case ACTION_USER_GET_STORY_USER:
      return {
        ...state,
        stories: action.payload
      };
    case ACTION_USER_GET_FRIENDS_HAVE_STORY:
      return {
        ...state,
        friendsHaveStory: action.payload
      };
    case ACTION_USER_GET_TOKEN_MESSAGING:
      return {
        ...state,
        tokenMessaging: action.payload
      };
    case ACTION_USER_HOT_TOAST:
      return {
        ...state,
        hotToast: action.payload
      };
    case ACTION_USER_BACKDROP:
      return {
        ...state,
        backdrop: action.payload
      };
    default:
      return state;
  }
};
export default userReducer;
