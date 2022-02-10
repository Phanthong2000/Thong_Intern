import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { ACTION_POST_GET_ALL, ACTION_POST_GET_FAIL } from './types';

export const actionPostGetAll = (data) => ({
  type: ACTION_POST_GET_ALL,
  payload: data
});
export const actionPostGetFail = (data) => ({
  type: ACTION_POST_GET_FAIL,
  payload: data
});
export const getAllPosts = (id) => (dispatch) => {
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
      const postSort = data.sort((a, b) => b.createdAt - a.createdAt);
      dispatch(actionPostGetAll(postSort));
    });
  }
};
