import { ACTION_CHAT_GET_ALL_CHAT } from './types';

export const actionChatGetAllChat = (data) => ({
  type: ACTION_CHAT_GET_ALL_CHAT,
  payload: data
});
