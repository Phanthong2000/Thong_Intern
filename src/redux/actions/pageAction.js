import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  ACTION_PAGE_GET_YOUR_PAGES,
  ACTION_PAGE_GET_ALL_PAGES,
  ACTION_PAGE_GET_LIKED_PAGES,
  ACTION_PAGE_MODAL_INVITE,
  ACTION_PAGE_GET_ALL_INVITES
} from './types';

export const actionPageGetYourPages = (data) => ({
  type: ACTION_PAGE_GET_YOUR_PAGES,
  payload: data
});
export const actionPageGetAllPages = (data) => ({
  type: ACTION_PAGE_GET_ALL_PAGES,
  payload: data
});
export const actionPageGetLikedPages = (data) => ({
  type: ACTION_PAGE_GET_LIKED_PAGES,
  payload: data
});
export const actionPageModalInvite = (data) => ({
  type: ACTION_PAGE_MODAL_INVITE,
  payload: data
});
export const actionPageGetAllInvites = (data) => ({
  type: ACTION_PAGE_GET_ALL_INVITES,
  payload: data
});
export const actionGetYourPages = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'pages'), where('userCreate', '==', id)));
  if (!data.empty) {
    const allPages = [];
    data.docs.forEach((page) => {
      allPages.push({
        ...page.data(),
        id: page.id
      });
    });
    dispatch(actionPageGetYourPages(allPages.sort((a, b) => b.createdAt - a.createdAt)));
  }
};
export const actionGetAllPages = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'pages'), where('userCreate', '!=', id)));
  if (!data.empty) {
    const allPages = [];
    data.docs.forEach((page) => {
      if (!page.data().likes.includes(id) && !page.data().followers.includes(id))
        allPages.push({
          ...page.data(),
          id: page.id
        });
    });
    dispatch(actionPageGetAllPages(allPages.sort((a, b) => b.createdAt - a.createdAt)));
  }
};
export const actionGetLikedPages = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'pages'), where('userCreate', '!=', id)));
  if (!data.empty) {
    const allPages = [];
    data.docs.forEach((page) => {
      if (page.data().likes.includes(id) || page.data().followers.includes(id)) {
        allPages.push({
          ...page.data(),
          id: page.id
        });
      }
    });
    dispatch(actionPageGetLikedPages(allPages.sort((a, b) => b.createdAt - a.createdAt)));
  }
};
export const actionGetAllInvites = (id) => async (dispatch) => {
  const data = await getDocs(
    query(collection(db, 'invites'), where('receiverId', '==', id), where('status', '==', false))
  );
  if (data.empty) {
    dispatch(actionPageGetAllInvites([]));
  }
  if (!data.empty) {
    const allInvites = [];
    data.docs.forEach((invite) => {
      allInvites.push({
        ...invite.data(),
        id: invite.id
      });
    });
    dispatch(actionPageGetAllInvites(allInvites.sort((a, b) => b.createdAt - a.createdAt)));
  }
};
