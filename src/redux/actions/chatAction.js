import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  ACTION_CHAT_GET_ALL_CHAT,
  ACTION_CHAT_GET_CHATBOX,
  ACTION_CHAT_GET_ALL_MESSAGES_CHATBOX,
  ACTION_CHAT_LOAD_ALL_MESSAGES_CHATBOX_SUCCESS,
  ACTION_CHAT_DELETE_MESSAGE,
  ACTION_CHAT_ADD_IMAGE_MESSAGE,
  ACTION_CHAT_DELETE_IMAGE_MESSAGE,
  ACTION_CHAT_CLEAR_IMAGE_MESSAGE,
  ACTION_CHAT_ADD_MESSAGE,
  ACTION_CHAT_UPDATE_MESSAGE,
  ACTION_CHAT_GET_CHATBOX_HOME,
  ACTION_CHAT_ADD_MESSAGE_CHATBOX_HOME,
  ACTION_CHAT_SEND_REACTION,
  ACTION_CHAT_UPDATE_REACTION_MESSAGE,
  ACTION_CHAT_INPUTTING,
  ACTION_CHAT_GET_CHATGROUP_USER,
  ACTION_CHAT_GET_NEW_CHATBOX_HOME
} from './types';

export const actionChatGetAllChat = (data) => ({
  type: ACTION_CHAT_GET_ALL_CHAT,
  payload: data
});
export const actionChatGetChatbox = (data) => ({
  type: ACTION_CHAT_GET_CHATBOX,
  payload: data
});
export const actionChatGetAllMessagesChatBox = (data) => ({
  type: ACTION_CHAT_GET_ALL_MESSAGES_CHATBOX,
  payload: data
});
export const actionChatLoadAllMessagesChatboxSuccess = () => ({
  type: ACTION_CHAT_LOAD_ALL_MESSAGES_CHATBOX_SUCCESS
});
export const actionChatDeleteMessage = (data) => ({
  type: ACTION_CHAT_DELETE_MESSAGE,
  payload: data
});
export const actionChatAddImageMessage = (data) => ({
  type: ACTION_CHAT_ADD_IMAGE_MESSAGE,
  payload: data
});
export const actionChatDeleteImageMessage = (data) => ({
  type: ACTION_CHAT_DELETE_IMAGE_MESSAGE,
  payload: data
});
export const actionChatClearImageMessage = () => ({
  type: ACTION_CHAT_CLEAR_IMAGE_MESSAGE
});
export const actionChatAddMessage = (data) => ({
  type: ACTION_CHAT_ADD_MESSAGE,
  payload: data
});
export const actionChatUpdateMessage = (data) => ({
  type: ACTION_CHAT_UPDATE_MESSAGE,
  payload: data
});
export const actionChatGetChatboxHome = (data) => ({
  type: ACTION_CHAT_GET_CHATBOX_HOME,
  payload: data
});
export const actionChatAddMessageChatboxHome = () => ({
  type: ACTION_CHAT_ADD_MESSAGE_CHATBOX_HOME
});
export const actionChatSendReaction = () => ({
  type: ACTION_CHAT_SEND_REACTION
});
export const actionChatUpdateReactionMessage = (data) => ({
  type: ACTION_CHAT_UPDATE_REACTION_MESSAGE,
  payload: data
});
export const actionChatInputting = (data) => ({
  type: ACTION_CHAT_INPUTTING,
  payload: data
});
export const actionChatGetChatgroupUser = (data) => ({
  type: ACTION_CHAT_GET_CHATGROUP_USER,
  payload: data
});
export const actionChatGetNewChatboxHome = (data) => ({
  type: ACTION_CHAT_GET_NEW_CHATBOX_HOME,
  payload: data
});
export const actionGetAllChatSort = (id) => async (dispatch) => {
  const data1 = await getDocs(query(collection(db, 'chatboxs'), where('user1', '==', id)));
  const data2 = await getDocs(query(collection(db, 'chatboxs'), where('user2', '==', id)));
  const data3 = await getDocs(
    query(collection(db, 'chatboxs'), where('members', 'array-contains', id))
  );
  if (data1.empty && data2.empty && data3.empty) {
    return dispatch(actionChatGetAllChat([]));
  }
  const chatboxs = [];
  data1.docs.forEach((chatbox) => {
    chatboxs.push({
      ...chatbox.data(),
      id: chatbox.id,
      tempId: chatbox.data().user2
    });
  });
  data2.docs.forEach((chatbox) => {
    chatboxs.push({
      ...chatbox.data(),
      id: chatbox.id,
      tempId: chatbox.data().user1
    });
  });
  data3.docs.forEach((chatbox) => {
    chatboxs.push({
      ...chatbox.data(),
      id: chatbox.id,
      tempId: chatbox.data().userId
    });
  });
  const chatboxsSort = chatboxs.sort((a, b) => b.updatedAt - a.updatedAt);
  return dispatch(actionChatGetAllChat(chatboxsSort));
};

export const actionGetAllChat = (id) => async (dispatch) => {
  const data1 = await getDocs(query(collection(db, 'chatboxs'), where('user1', '==', id)));
  const data2 = await getDocs(query(collection(db, 'chatboxs'), where('user2', '==', id)));
  if (data1.empty && data2.empty) {
    return dispatch(actionChatGetAllChat([]));
  }
  const chatboxs = [];
  data1.docs.forEach((chatbox) => {
    chatboxs.push({
      ...chatbox.data(),
      id: chatbox.id,
      tempId: chatbox.data().user2
    });
  });
  data2.docs.forEach((chatbox) => {
    chatboxs.push({
      ...chatbox.data(),
      id: chatbox.id,
      tempId: chatbox.data().user1
    });
  });
  return dispatch(actionChatGetAllChat(chatboxs));
};

// export const actionGetAllMessagesChatbox = (id) => async (dispatch) => {
//   const data = await getDocs(query(collection(db, 'messages'), where('chatboxId', '==', id)));
//   if (data.empty) return dispatch(actionChatGetAllMessagesChatBox([]));
//   const messages = [];
//   data.docs.forEach((message) => {
//     messages.push({ ...message.data(), id: message.id });
//   });
//   return dispatch(actionChatGetAllMessagesChatBox(messages));
// };
export const actionGetAllMessagesChatbox = (id) => (dispatch) => {
  getDocs(query(collection(db, 'messages'), where('chatboxId', '==', id))).then((snapshots) => {
    if (snapshots.empty) {
      dispatch(actionChatGetAllMessagesChatBox([]));
      dispatch(actionChatLoadAllMessagesChatboxSuccess());
    } else {
      const messages = [];
      snapshots.docs.forEach((message) => {
        messages.push({ ...message.data(), id: message.id });
      });
      const messageSort = messages.sort((a, b) => a.createdAt - b.createdAt);
      dispatch(actionChatGetAllMessagesChatBox(messageSort));
      dispatch(actionChatLoadAllMessagesChatboxSuccess());
    }
  });
};
export const actionGetChatgroupUser = (id) => async (dispatch) => {
  const data = await getDocs(
    query(
      collection(db, 'chatboxs'),
      where('type', '==', 'group'),
      where('members', 'array-contains', id)
    )
  );
  const chatgroups = [];
  if (data.empty) {
    dispatch(actionChatGetChatgroupUser([]));
  } else {
    data.docs.forEach((chatgroup) => {
      chatgroups.push({
        ...chatgroup.data(),
        id: chatgroup.id
      });
    });
  }
  const chatgroupSort = chatgroups.sort((a, b) => b.updatedAt - a.updatedAt);
  dispatch(actionChatGetChatgroupUser(chatgroupSort));
};
