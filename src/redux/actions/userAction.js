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
} from './types';

export const actionUserOpenSearch = () => ({ type: ACTION_USER_OPEN_SEARCH });
export const actionUserCloseSearch = () => ({ type: ACTION_USER_CLOSE_SEARCH });
export const actionUserCloseProfile = () => ({ type: ACTION_USER_CLOSE_PROFILE });
export const actionUserOpenProfile = () => ({ type: ACTION_USER_OPEN_PROFILE });
export const actionUserLogin = () => ({ type: ACTION_USER_LOGIN });
export const actionUserLogout = () => ({ type: ACTION_USER_LOGOUT });
export const actionUserOpenNotifications = () => ({ type: ACTION_USER_OPEN_NOTIFICATIONS });
export const actionUserCloseNotifications = () => ({ type: ACTION_USER_CLOSE_NOTIFICATIONS });
export const actionUserOpenRequests = () => ({ type: ACTION_USER_OPEN_REQUESTS });
export const actionUserCloseRequests = () => ({ type: ACTION_USER_CLOSE_REQUESTS });
