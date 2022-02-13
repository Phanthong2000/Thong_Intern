import { collection, getDocs, query, where } from 'firebase/firestore';
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
  ACTION_USER_GET_ALL_FRIEND_USER
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
