import {
  ACTION_USER_CLOSE_SEARCH,
  ACTION_USER_OPEN_SEARCH,
  ACTION_USER_CLOSE_PROFILE,
  ACTION_USER_OPEN_PROFILE
} from '../actions/types';

const defaultState = {
  isLoggedIn: !!localStorage.getItem('user'),
  isSearching: false,
  isOpeningProfile: false
};
const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_USER_OPEN_SEARCH:
      return {
        ...state,
        isSearching: true,
        isOpeningProfile: false
      };
    case ACTION_USER_CLOSE_SEARCH:
      return {
        ...state,
        isSearching: false,
        isOpeningProfile: false
      };
    case ACTION_USER_CLOSE_PROFILE:
      return {
        ...state,
        isOpeningProfile: false,
        isSearching: false
      };
    case ACTION_USER_OPEN_PROFILE:
      return {
        ...state,
        isOpeningProfile: true,
        isSearching: false
      };
    default:
      return state;
  }
};
export default userReducer;
