import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  ACTION_POST_GET_ALL,
  ACTION_POST_GET_FAIL,
  ACTION_CLOSE_SNACKBAR,
  ACTION_OPEN_SNACKBAR
} from './types';

export const actionPostGetAll = (data) => ({
  type: ACTION_POST_GET_ALL,
  payload: data
});
export const actionPostGetFail = (data) => ({
  type: ACTION_POST_GET_FAIL,
  payload: data
});
export const actionOpenSnackbar = (data) => ({
  type: ACTION_OPEN_SNACKBAR,
  payload: {
    ...data
  }
});
export const actionCloseSnackbar = () => ({
  type: ACTION_CLOSE_SNACKBAR
});
export const getAllPosts = (id, sort) => (dispatch) => {
  const posts = getDocs(query(collection(db, 'posts'), where('userId', '==', id)));
  if (posts.empty) {
    dispatch(actionPostGetFail([]));
  } else {
    posts.then((snapshot) => {
      const data = [];
      snapshot.docs.forEach((post) =>
        data.push({
          ...post.data(),
          id: post.id
        })
      );
      if (sort === 'desc') {
        const postSort = data.sort((a, b) => b.createdAt - a.createdAt);
        dispatch(actionPostGetAll(postSort));
      } else {
        const postSort = data.sort((a, b) => a.createdAt - b.createdAt);
        dispatch(actionPostGetAll(postSort));
      }
    });
  }
};
