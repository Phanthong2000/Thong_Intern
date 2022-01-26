import {
  ACTION_USER_CLOSE_SEARCH,
  ACTION_USER_OPEN_SEARCH,
  ACTION_USER_CLOSE_PROFILE,
  ACTION_USER_OPEN_PROFILE
} from './types';

export const actionUserOpenSearch = () => ({ type: ACTION_USER_OPEN_SEARCH });
export const actionUserCloseSearch = () => ({ type: ACTION_USER_CLOSE_SEARCH });
export const actionUserCloseProfile = () => ({ type: ACTION_USER_CLOSE_PROFILE });
export const actionUserOpenProfile = () => ({ type: ACTION_USER_OPEN_PROFILE });
