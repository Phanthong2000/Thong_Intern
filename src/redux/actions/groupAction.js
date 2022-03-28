import { async } from '@firebase/util';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  ACTION_GROUP_GET_GROUPS_YOU_MANAGE,
  ACTION_GROUP_GET_GROUPS_YOU_JOINED,
  ACTION_GROUP_MODAL_CREATE_POST,
  ACTION_GROUP_UPDATE,
  ACTION_GROUP_GET_POSTS_ALL_GROUP,
  ACTION_GROUP_GET_ALL_GROUPS,
  ACTION_GROUP_MODAL_INVITE
} from './types';

export const actionGroupGetGroupsYouManage = (data) => ({
  type: ACTION_GROUP_GET_GROUPS_YOU_MANAGE,
  payload: data
});
export const actionGroupGetGroupsYouJoined = (data) => ({
  type: ACTION_GROUP_GET_GROUPS_YOU_JOINED,
  payload: data
});
export const actionGroupModalCreatePost = (data) => ({
  type: ACTION_GROUP_MODAL_CREATE_POST,
  payload: data
});
export const actionGroupUpdate = () => ({
  type: ACTION_GROUP_UPDATE
});
export const actionGroupGetPostsAllGroup = (data) => ({
  type: ACTION_GROUP_GET_POSTS_ALL_GROUP,
  payload: data
});
export const actionGroupGetAllGroups = (data) => ({
  type: ACTION_GROUP_GET_ALL_GROUPS,
  payload: data
});
export const actionGroupModalInvite = (data) => ({
  type: ACTION_GROUP_MODAL_INVITE,
  payload: data
});
export const actionGetGroupsYouManage = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'groups'), where('userCreate', '==', id)));
  if (data.empty) {
    dispatch(actionGroupGetGroupsYouManage([]));
  } else {
    const groups = [];
    data.docs.forEach((group) => {
      groups.push({
        ...group.data(),
        id: group.id
      });
    });
    const groupsSort = groups.sort((a, b) => b.createdAt - a.createdAt);
    dispatch(actionGroupGetGroupsYouManage(groupsSort));
  }
};
export const actionGetGroupsYouJoined = (id) => async (dispatch) => {
  const data = await getDocs(
    query(collection(db, 'groups'), where('members', 'array-contains', id))
  );
  if (data.empty) {
    dispatch(actionGroupGetGroupsYouJoined([]));
  } else {
    const groups = [];
    data.docs.forEach((group) => {
      if (group.data().userCreate !== id)
        groups.push({
          ...group.data(),
          id: group.id
        });
    });
    dispatch(actionGroupGetGroupsYouJoined(groups));
  }
};

const getAllPostsByGroup = async (id) => {
  const data = await getDocs(query(collection(db, 'posts'), where('groupId', '==', id)));
  if (data.empty) return [];
  const allPosts = [];
  data.docs.forEach((post) => {
    allPosts.push({
      ...post.data(),
      id: post.id
    });
  });
  return allPosts.sort((a, b) => b.createdAt - a.createdAt);
};
export const actionGetPostsAllGroup = (id) => async (dispatch) => {
  const data = await getDocs(
    query(collection(db, 'groups'), where('members', 'array-contains', id))
  );
  if (data.empty) {
    dispatch(actionGroupGetPostsAllGroup([]));
  } else {
    const allPosts = [];
    let count = 0;
    data.docs.forEach((group) => {
      getAllPostsByGroup(group.id)
        .then((snapshot) => {
          count += 1;
          snapshot.forEach((post) => {
            allPosts.push(post);
          });
        })
        .then(() => {
          if (count === data.size) {
            dispatch(
              actionGroupGetPostsAllGroup(allPosts.sort((a, b) => b.createdAt - a.createdAt))
            );
          }
        });
    });
  }
};
export const actionGetAllGroups = (id) => async (dispatch) => {
  const data = await getDocs(collection(db, 'groups'));
  if (data.empty) {
    dispatch(actionGroupGetAllGroups([]));
  } else {
    const allGroups = [];
    data.docs.forEach((group) => {
      if (!group.data().members.includes(id) && !group.data().requests.includes(id)) {
        allGroups.push({
          ...group.data(),
          id: group.id
        });
      }
    });
    dispatch(actionGroupGetAllGroups(allGroups.sort((a, b) => b.createdAt - a.createdAt)));
  }
};
