import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
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
  ACTION_USER_GET_ALL_CONTACT_ONLINE,
  ACTION_USER_GET_ALL_FRIEND_OTHER,
  ACTION_USER_BROADCAST_SOCKET,
  ACTION_USER_OPEN_MESSENGER,
  ACTION_USER_CLOSE_MESSENGER,
  ACTION_USER_OPEN_EDIT_DETAIL
} from './types';

export const actionUserOpenSearch = () => ({ type: ACTION_USER_OPEN_SEARCH });
export const actionUserCloseSearch = () => ({ type: ACTION_USER_CLOSE_SEARCH });
export const actionUserOpenMessenger = () => ({ type: ACTION_USER_OPEN_MESSENGER });
export const actionUserCloseMessenger = () => ({ type: ACTION_USER_CLOSE_MESSENGER });
export const actionUserCloseProfile = () => ({ type: ACTION_USER_CLOSE_PROFILE });
export const actionUserOpenProfile = () => ({ type: ACTION_USER_OPEN_PROFILE });
export const actionUserLogin = () => ({ type: ACTION_USER_LOGIN });
export const actionUserLogout = () => ({ type: ACTION_USER_LOGOUT });
export const actionUserOpenNotifications = () => ({ type: ACTION_USER_OPEN_NOTIFICATIONS });
export const actionUserCloseNotifications = () => ({ type: ACTION_USER_CLOSE_NOTIFICATIONS });
export const actionUserOpenRequests = () => ({ type: ACTION_USER_OPEN_REQUESTS });
export const actionUserCloseRequests = () => ({ type: ACTION_USER_CLOSE_REQUESTS });
export const actionUserOpenEditDetail = (data) => ({
  type: ACTION_USER_OPEN_EDIT_DETAIL,
  payload: data
});
export const actionUserOpenLoadingUpdateProfile = () => ({
  type: ACTION_USER_OPEN_LOADING_UPDATE_PROFILE
});
export const actionUserCloseLoadingUpdateProfile = () => ({
  type: ACTION_USER_CLOSE_LOADING_UPDATE_PROFILE
});
export const actionUserContactUserAndOther = (data) => ({
  type: ACTION_USER_CONTACT_USER_AND_OTHER,
  payload: data
});
export const actionUserGetAllFriendUser = (data) => ({
  type: ACTION_USER_GET_ALL_FRIEND_USER,
  payload: data
});
export const actionUserGetAllFriendOther = (data) => ({
  type: ACTION_USER_GET_ALL_FRIEND_OTHER,
  payload: data
});
export const actionUserGetUserSearch = (data) => ({
  type: ACTION_USER_GET_USER_SEARCH,
  payload: data
});
export const actionUserScrollTop = () => ({
  type: ACTION_USER_SCROLL_TOP
});
export const actionUserGetAllFriendRequest = (data) => ({
  type: ACTION_USER_GET_ALL_FRIEND_REQUESTS,
  payload: data
});
export const actionUserLoadingGetAllRequestFriend = () => ({
  type: ACTION_USER_LOADING_GET_ALL_FRIEND_REQUESTS
});
export const actionUserDeleteFriendRequest = (data) => ({
  type: ACTION_USER_DELETE_FRIEND_REQUEST,
  payload: data
});
export const actionUserGetAllFriendUserManual = (data) => ({
  type: ACTION_USER_GET_ALL_FRIEND_USER_MANUAL,
  payload: data
});
export const actionUserGetAllContactOnline = (data) => ({
  type: ACTION_USER_GET_ALL_CONTACT_ONLINE,
  payload: data
});
export const actionGetContact = (userId, otherId) => async (dispatch) => {
  const contact1 = await getDocs(
    query(
      collection(db, 'contacts'),
      where('receiverId', '==', otherId),
      where('senderId', '==', userId)
    )
  );
  const contact2 = await getDocs(
    query(
      collection(db, 'contacts'),
      where('receiverId', '==', userId),
      where('senderId', '==', otherId)
    )
  );
  if (contact1.empty && contact2.empty) {
    return dispatch(
      actionUserContactUserAndOther({
        id: '',
        status: 'none'
      })
    );
  }
  if (!contact1.empty) {
    if (contact1.docs.at(0).data().status) {
      return dispatch(
        actionUserContactUserAndOther({
          id: contact1.docs.at(0).id,
          status: 'friend'
        })
      );
    }
    return dispatch(
      actionUserContactUserAndOther({
        id: contact1.docs.at(0).id,
        status: 'sent'
      })
    );
  }
  if (!contact2.empty) {
    if (contact2.docs.at(0).data().status) {
      return dispatch(
        actionUserContactUserAndOther({
          id: contact2.docs.at(0).id,
          status: 'friend'
        })
      );
    }
    return dispatch(
      actionUserContactUserAndOther({
        id: contact2.docs.at(0).id,
        status: 'received'
      })
    );
  }
};
export const actionGetAllFriendUser = (id) => async (dispatch) => {
  const data1 = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
  );
  const data2 = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
  );
  if (data1.empty && data2.empty) {
    return dispatch(actionUserGetAllFriendUser([]));
  }
  const contacts = [];
  data1.docs.forEach((contact) => {
    contacts.push({
      friendId: contact.data().receiverId,
      id: contact.id,
      createdAt: contact.data().createdAt
    });
  });
  data2.docs.forEach((contact) => {
    contacts.push({
      friendId: contact.data().senderId,
      id: contact.id,
      createdAt: contact.data().createdAt
    });
  });
  const contactSort = contacts.sort((a, b) => b.createdAt - a.createdAt);
  return dispatch(actionUserGetAllFriendUser(contactSort));
};
export const actionGetAllFriendOther = (id) => async (dispatch) => {
  const data1 = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
  );
  const data2 = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
  );
  if (data1.empty && data2.empty) {
    return dispatch(actionUserGetAllFriendOther([]));
  }
  const contacts = [];
  data1.docs.forEach((contact) => {
    contacts.push({
      friendId: contact.data().receiverId,
      id: contact.id,
      createdAt: contact.data().createdAt
    });
  });
  data2.docs.forEach((contact) => {
    contacts.push({
      friendId: contact.data().senderId,
      id: contact.id,
      createdAt: contact.data().createdAt
    });
  });
  const contactSort = contacts.sort((a, b) => b.createdAt - a.createdAt);
  return dispatch(actionUserGetAllFriendOther(contactSort));
};
export const actionGetAllFriendRequest = (id) => (dispatch) => {
  getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', false))
  ).then((snapshots) => {
    if (snapshots.empty) {
      dispatch(actionUserGetAllFriendRequest([]));
      dispatch(actionUserLoadingGetAllRequestFriend());
    } else {
      const requests = [];
      snapshots.docs.forEach((request) => {
        requests.push({
          ...request.data(),
          id: request.id
        });
      });
      const requestsSort = requests.sort((a, b) => b.createdAt - a.createdAt);
      dispatch(actionUserGetAllFriendRequest(requestsSort));
      dispatch(actionUserLoadingGetAllRequestFriend());
    }
  });
};
export const actionGetAllFriendUserManual = (id) => async (dispatch) => {
  const data1 = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
  );
  const data2 = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
  );
  if (data1.empty && data2.empty) {
    return dispatch(actionUserGetAllFriendUserManual([]));
  }
  const contacts = [];
  data1.docs.forEach((contact) => {
    contacts.push(contact.data().receiverId);
  });
  data2.docs.forEach((contact) => {
    contacts.push(contact.data().senderId);
  });
  return dispatch(actionUserGetAllFriendUserManual(contacts));
};

export const actionTestSearch = (data) => ({
  type: TEST_SEARCH,
  payload: data
});
export const actionUserBroadcastSocket = (data) => ({
  type: ACTION_USER_BROADCAST_SOCKET,
  payload: data
});
