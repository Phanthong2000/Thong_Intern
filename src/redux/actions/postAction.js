import { getDocs, collection, query, where } from 'firebase/firestore';
import { m } from 'framer-motion';
import { db } from '../../firebase-config';
import {
  ACTION_POST_GET_ALL,
  ACTION_POST_GET_FAIL,
  ACTION_CLOSE_SNACKBAR,
  ACTION_OPEN_SNACKBAR,
  ACTION_POST_CLOSE_CREATE_POST,
  ACTION_POST_OPEN_CREATE_POST,
  ACTION_POST_CLOSE_TAG_PEOPLE,
  ACTION_POST_OPEN_TAG_PEOPLE,
  ACTION_POST_CLEAR_TAGS,
  ACTION_POST_ADD_TAG,
  ACTION_POST_REMOVE_TAG,
  ACTION_POST_CLOSE_CONFIRM_DELETE_POST,
  ACTION_POST_OPEN_CONFIRM_DELETE_POST,
  ACTION_POST_GET_ALL_OTHER,
  ACTION_POST_LOADING_GET_ALL_OTHER,
  ACTION_POST_GET_ALL_POST_ALL_FRIEND,
  ACTION_POST_LOADING_GET_ALL_POST_ALL_FRIEND,
  ACTION_POST_MODAL_SHARE_POST,
  ACTION_POST_MODAL_REACTIONS_POST
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
export const actionPostOpenCreatePost = () => ({
  type: ACTION_POST_OPEN_CREATE_POST
});
export const actionPostCloseCreatePost = () => ({
  type: ACTION_POST_CLOSE_CREATE_POST
});
export const actionPostOpenTagPeople = () => ({
  type: ACTION_POST_OPEN_TAG_PEOPLE
});
export const actionPostCloseTagPeople = () => ({
  type: ACTION_POST_CLOSE_TAG_PEOPLE
});
export const actionPostClearTags = () => ({
  type: ACTION_POST_CLEAR_TAGS
});
export const actionPostAddTag = (data) => ({
  type: ACTION_POST_ADD_TAG,
  payload: data
});
export const actionPostRemoveTag = (data) => ({
  type: ACTION_POST_REMOVE_TAG,
  payload: data
});
export const actionPostOpenConfirmDeletePost = (data) => ({
  type: ACTION_POST_OPEN_CONFIRM_DELETE_POST,
  payload: data
});
export const actionPostCloseConfirmDeletePost = () => ({
  type: ACTION_POST_CLOSE_CONFIRM_DELETE_POST
});
export const actionPostGetAllOther = (data) => ({
  type: ACTION_POST_GET_ALL_OTHER,
  payload: data
});
export const actionPostGetLoadingAllOther = () => ({
  type: ACTION_POST_LOADING_GET_ALL_OTHER
});
export const actionPostGetAllPostAllFriend = (data) => ({
  type: ACTION_POST_GET_ALL_POST_ALL_FRIEND,
  payload: data
});
export const actionPostLoadingGetAllPostAllFriend = () => ({
  type: ACTION_POST_LOADING_GET_ALL_POST_ALL_FRIEND
});
export const actionPostModalSharePost = (data) => ({
  type: ACTION_POST_MODAL_SHARE_POST,
  payload: data
});
export const actionPostModalReactionsPost = (data) => ({
  type: ACTION_POST_MODAL_REACTIONS_POST,
  payload: data
});
export const actionGetAllPostAllFriend = (id) => (dispatch) => {
  const allPostUser = [];
  getDocs(
    query(collection(db, 'posts'), where('userId', '==', id), where('status', '==', 'public'))
  )
    .then((snapshots) => {
      if (!snapshots.empty) {
        snapshots.docs.forEach((post) => {
          if (!post.data().groupId)
            allPostUser.push({
              ...post.data(),
              id: post.id
            });
        });
      }
    })
    .then(() => {
      getDocs(
        query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
      ).then((snapshots) => {
        let count = 0;
        if (!snapshots.empty) {
          snapshots.docs.forEach((contact) => {
            // count += 1;
            // console.log('1', count);
            getDocs(
              query(
                collection(db, 'posts'),
                where('userId', '==', contact.data().receiverId),
                where('status', '==', 'public')
              )
            )
              .then((posts) => {
                count += 1;
                // console.log('2', count);
                if (!posts.empty) {
                  posts.docs.forEach((post) => {
                    if (!post.data().groupId)
                      allPostUser.push({
                        ...post.data(),
                        id: post.id
                      });
                  });
                }
              })
              .then(() => {
                if (count === snapshots.size) {
                  getDocs(
                    query(
                      collection(db, 'contacts'),
                      where('receiverId', '==', id),
                      where('status', '==', true)
                    )
                  ).then((snapshots2) => {
                    let count2 = 0;
                    if (!snapshots2.empty) {
                      snapshots2.docs.forEach((contact2) => {
                        getDocs(
                          query(
                            collection(db, 'posts'),
                            where('userId', '==', contact2.data().senderId),
                            where('status', '==', 'public')
                          )
                        )
                          .then((posts2) => {
                            count2 += 1;
                            if (!posts2.empty) {
                              posts2.docs.forEach((post) => {
                                if (!post.data().groupId)
                                  allPostUser.push({
                                    ...post.data(),
                                    id: post.id
                                  });
                              });
                            }
                          })
                          .then(() => {
                            if (count2 === snapshots2.size) {
                              getDocs(
                                query(
                                  collection(db, 'pages'),
                                  where('followers', 'array-contains', id)
                                )
                              ).then((snapshots) => {
                                // 1
                                if (snapshots.empty) {
                                  getDocs(
                                    query(
                                      collection(db, 'groups'),
                                      where('members', 'array-contains', id)
                                    )
                                  ).then((snapshots) => {
                                    if (snapshots.empty) {
                                      console.log(allPostUser);
                                      const allPostUserSort = allPostUser.sort(
                                        (a, b) => b.createdAt - a.createdAt
                                      );
                                      dispatch(actionPostGetAllPostAllFriend(allPostUserSort));
                                      dispatch(actionPostLoadingGetAllPostAllFriend());
                                    } else {
                                      let count4 = 0;
                                      let checkEmpty1 = 0;
                                      snapshots.docs.forEach((group) => {
                                        getDocs(
                                          query(
                                            collection(db, 'posts'),
                                            where('groupId', '==', group.id)
                                          )
                                        )
                                          .then((snapshot) => {
                                            count4 += 1;
                                            if (snapshot.empty) checkEmpty1 += 1;
                                            else {
                                              snapshot.docs.forEach((post) => {
                                                allPostUser.push({
                                                  ...post.data(),
                                                  id: post.id
                                                });
                                              });
                                            }
                                          })
                                          .then(() => {
                                            if (count4 === snapshots.size) {
                                              if (checkEmpty1 === count4) {
                                                console.log(allPostUser);
                                                const allPostUserSort = allPostUser.sort(
                                                  (a, b) => b.createdAt - a.createdAt
                                                );
                                                dispatch(
                                                  actionPostGetAllPostAllFriend(allPostUserSort)
                                                );
                                                dispatch(actionPostLoadingGetAllPostAllFriend());
                                              } else {
                                                console.log(allPostUser);
                                                const allPostUserSort = allPostUser.sort(
                                                  (a, b) => b.createdAt - a.createdAt
                                                );
                                                dispatch(
                                                  actionPostGetAllPostAllFriend(allPostUserSort)
                                                );
                                                dispatch(actionPostLoadingGetAllPostAllFriend());
                                              }
                                            }
                                          });
                                      });
                                    }
                                  });
                                } else {
                                  let count3 = 0;
                                  let checkEmpty = 0;
                                  snapshots.docs.forEach((page) => {
                                    getDocs(
                                      query(collection(db, 'posts'), where('pageId', '==', page.id))
                                    )
                                      .then((snapshot) => {
                                        count3 += 1;
                                        if (snapshot.empty) checkEmpty += 1;
                                        else {
                                          snapshot.docs.forEach((post) => {
                                            allPostUser.push({
                                              ...post.data(),
                                              id: post.id
                                            });
                                          });
                                        }
                                      })
                                      .then(() => {
                                        if (count3 === snapshots.size) {
                                          // 2
                                          if (checkEmpty === count3) {
                                            getDocs(
                                              query(
                                                collection(db, 'groups'),
                                                where('members', 'array-contains', id)
                                              )
                                            ).then((snapshots) => {
                                              if (snapshots.empty) {
                                                console.log(allPostUser);
                                                const allPostUserSort = allPostUser.sort(
                                                  (a, b) => b.createdAt - a.createdAt
                                                );
                                                dispatch(
                                                  actionPostGetAllPostAllFriend(allPostUserSort)
                                                );
                                                dispatch(actionPostLoadingGetAllPostAllFriend());
                                              } else {
                                                let count4 = 0;
                                                let checkEmpty1 = 0;
                                                snapshots.docs.forEach((group) => {
                                                  getDocs(
                                                    query(
                                                      collection(db, 'posts'),
                                                      where('groupId', '==', group.id)
                                                    )
                                                  )
                                                    .then((snapshot) => {
                                                      count4 += 1;
                                                      if (snapshot.empty) checkEmpty1 += 1;
                                                      else {
                                                        snapshot.docs.forEach((post) => {
                                                          allPostUser.push({
                                                            ...post.data(),
                                                            id: post.id
                                                          });
                                                        });
                                                      }
                                                    })
                                                    .then(() => {
                                                      if (count4 === snapshots.size) {
                                                        if (checkEmpty1 === count4) {
                                                          console.log(allPostUser);
                                                          const allPostUserSort = allPostUser.sort(
                                                            (a, b) => b.createdAt - a.createdAt
                                                          );
                                                          dispatch(
                                                            actionPostGetAllPostAllFriend(
                                                              allPostUserSort
                                                            )
                                                          );
                                                          dispatch(
                                                            actionPostLoadingGetAllPostAllFriend()
                                                          );
                                                        } else {
                                                          console.log(allPostUser);
                                                          const allPostUserSort = allPostUser.sort(
                                                            (a, b) => b.createdAt - a.createdAt
                                                          );
                                                          dispatch(
                                                            actionPostGetAllPostAllFriend(
                                                              allPostUserSort
                                                            )
                                                          );
                                                          dispatch(
                                                            actionPostLoadingGetAllPostAllFriend()
                                                          );
                                                        }
                                                      }
                                                    });
                                                });
                                              }
                                            });
                                          } else {
                                            // 3
                                            getDocs(
                                              query(
                                                collection(db, 'groups'),
                                                where('members', 'array-contains', id)
                                              )
                                            ).then((snapshots) => {
                                              if (snapshots.empty) {
                                                console.log(allPostUser);
                                                const allPostUserSort = allPostUser.sort(
                                                  (a, b) => b.createdAt - a.createdAt
                                                );
                                                dispatch(
                                                  actionPostGetAllPostAllFriend(allPostUserSort)
                                                );
                                                dispatch(actionPostLoadingGetAllPostAllFriend());
                                              } else {
                                                let count4 = 0;
                                                let checkEmpty1 = 0;
                                                snapshots.docs.forEach((group) => {
                                                  getDocs(
                                                    query(
                                                      collection(db, 'posts'),
                                                      where('groupId', '==', group.id)
                                                    )
                                                  )
                                                    .then((snapshot) => {
                                                      count4 += 1;
                                                      if (snapshot.empty) checkEmpty1 += 1;
                                                      else {
                                                        snapshot.docs.forEach((post) => {
                                                          allPostUser.push({
                                                            ...post.data(),
                                                            id: post.id
                                                          });
                                                        });
                                                      }
                                                    })
                                                    .then(() => {
                                                      if (count4 === snapshots.size) {
                                                        if (checkEmpty1 === count4) {
                                                          console.log(allPostUser);
                                                          const allPostUserSort = allPostUser.sort(
                                                            (a, b) => b.createdAt - a.createdAt
                                                          );
                                                          dispatch(
                                                            actionPostGetAllPostAllFriend(
                                                              allPostUserSort
                                                            )
                                                          );
                                                          dispatch(
                                                            actionPostLoadingGetAllPostAllFriend()
                                                          );
                                                        } else {
                                                          console.log(allPostUser);
                                                          const allPostUserSort = allPostUser.sort(
                                                            (a, b) => b.createdAt - a.createdAt
                                                          );
                                                          dispatch(
                                                            actionPostGetAllPostAllFriend(
                                                              allPostUserSort
                                                            )
                                                          );
                                                          dispatch(
                                                            actionPostLoadingGetAllPostAllFriend()
                                                          );
                                                        }
                                                      }
                                                    });
                                                });
                                              }
                                            });
                                          }
                                        }
                                      });
                                  });
                                }
                              });
                            }
                          });
                      });
                    }
                  });
                }
              });
          });
        }
      });
    });
};
export const getAllPosts = (id, sort) => (dispatch) => {
  const posts = getDocs(query(collection(db, 'posts'), where('userId', '==', id)));
  if (posts.empty) {
    dispatch(actionPostGetFail([]));
  } else {
    posts.then((snapshot) => {
      const data = [];
      snapshot.docs.forEach((post) => {
        if (!post.data().groupId)
          data.push({
            ...post.data(),
            id: post.id
          });
      });
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

export const getAllPostsOther = (id, sort) => (dispatch) => {
  getDocs(
    query(collection(db, 'posts'), where('userId', '==', id), where('status', '==', 'public'))
  ).then((snapshots) => {
    if (snapshots.empty) {
      dispatch(actionPostGetAllOther([]));
      dispatch(actionPostGetLoadingAllOther());
    } else {
      const posts = [];
      snapshots.docs.forEach((post) => {
        if (!post.data().groupId) {
          posts.push({
            ...post.data(),
            id: post.id
          });
        }
      });
      if (sort === 'desc') {
        const postsSort = posts.sort((a, b) => b.createdAt - a.createdAt);
        dispatch(actionPostGetAllOther(postsSort));
        dispatch(actionPostGetLoadingAllOther());
      } else {
        const postsSort = posts.sort((a, b) => a.createdAt - b.createdAt);
        dispatch(actionPostGetAllOther(postsSort));
        dispatch(actionPostGetLoadingAllOther());
      }
    }
  });
};
export const actionGetAllPostAllFriend2 = (id) => async (dispatch) => {
  const allPosts = [];
  const postUserCurrent = await getDocs(
    query(collection(db, 'posts'), where('userId', '==', id), where('status', '==', 'public'))
  );
  if (!postUserCurrent.empty) {
    postUserCurrent.docs.forEach((post) => {
      allPosts.push({
        ...post.data(),
        id: post.id
      });
    });
  }
  const userReceiver = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
  );
  if (!userReceiver.empty) {
    userReceiver.docs.forEach((contact) => {
      getDocs(
        query(collection(db, 'posts'), where('userId', '==', contact.data().receiverId))
      ).then((snapshots) => {
        if (!snapshots.empty) {
          snapshots.forEach((post) => {
            allPosts.push({
              ...post.data(),
              id: post.id
            });
          });
        }
      });
    });
    const userSender = await getDocs(
      query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
    );
    if (!userSender.empty) {
      userSender.docs.forEach((contact) => {
        getDocs(
          query(collection(db, 'posts'), where('userId', '==', contact.data().senderId))
        ).then((snapshots) => {
          if (!snapshots.empty) {
            snapshots.forEach((post) => {
              allPosts.push({
                ...post.data(),
                id: post.id
              });
            });
          }
        });
      });
    }
    dispatch(actionPostGetAllPostAllFriend(allPosts));
    dispatch(actionPostLoadingGetAllPostAllFriend());
    return;
  }
  const userSender = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
  );
  if (!userSender.empty) {
    userSender.docs.forEach((contact) => {
      getDocs(query(collection(db, 'posts'), where('userId', '==', contact.data().senderId))).then(
        (snapshots) => {
          if (!snapshots.empty) {
            snapshots.forEach((post) => {
              allPosts.push({
                ...post.data(),
                id: post.id
              });
            });
          }
        }
      );
    });
    if (!userReceiver.empty) {
      userReceiver.docs.forEach((contact) => {
        getDocs(
          query(collection(db, 'posts'), where('userId', '==', contact.data().receiverId))
        ).then((snapshots) => {
          if (!snapshots.empty) {
            snapshots.forEach((post) => {
              allPosts.push({
                ...post.data(),
                id: post.id
              });
            });
          }
        });
      });
    }
    dispatch(actionPostGetAllPostAllFriend(allPosts));
    dispatch(actionPostLoadingGetAllPostAllFriend());
  }
};
