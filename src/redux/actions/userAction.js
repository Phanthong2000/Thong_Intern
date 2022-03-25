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
  ACTION_USER_OPEN_EDIT_DETAIL,
  ACTION_USER_ADD_FRIEND_REQUEST,
  ACTION_USER_GET_ALL_NOTIFICATIONS,
  ACTION_USER_GET_BADGE_NOTIFICATION,
  ACTION_USER_HOVER_USERNAME,
  ACTION_USER_SEARCH_ALL_FRIEND,
  ACTION_USER_SEARCH_ALL_PEOPLE,
  ACTION_USER_SEARCH_ALL_REQUESTS,
  ACTION_USER_SEARCH_ALL_SENT,
  ACTION_USER_SEARCH_OTHERS,
  ACTION_USER_GET_ALL_STORY_USER,
  ACTION_USER_GET_STORY_USER,
  ACTION_USER_GET_FRIENDS_HAVE_STORY,
  ACTION_USER_GET_TOKEN_MESSAGING,
  ACTION_USER_DELETE_FRIEND_USER,
  ACTION_USER_HOT_TOAST,
  ACTION_USER_BACKDROP
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
export const actionUserDeleteFriend = (data) => ({
  type: ACTION_USER_DELETE_FRIEND_USER,
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
export const actionUserAddFriendRequest = (data) => ({
  type: ACTION_USER_ADD_FRIEND_REQUEST,
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
export const actionUserGetAllNotifications = (data) => ({
  type: ACTION_USER_GET_ALL_NOTIFICATIONS,
  payload: data
});
export const actionUserGetBadgeNotification = (data) => ({
  type: ACTION_USER_GET_BADGE_NOTIFICATION,
  payload: data
});
export const actionUserHoverUsername = (data) => ({
  type: ACTION_USER_HOVER_USERNAME,
  payload: data
});
export const actionUserSearchAllFriend = (data) => ({
  type: ACTION_USER_SEARCH_ALL_FRIEND,
  payload: data
});
export const actionUserSearchAllPeople = (data) => ({
  type: ACTION_USER_SEARCH_ALL_PEOPLE,
  payload: data
});
export const actionUserSearchAllSent = (data) => ({
  type: ACTION_USER_SEARCH_ALL_SENT,
  payload: data
});
export const actionUserSearchAllRequests = (data) => ({
  type: ACTION_USER_SEARCH_ALL_REQUESTS,
  payload: data
});
export const actionUserSearchOthers = (data) => ({
  type: ACTION_USER_SEARCH_OTHERS,
  payload: data
});
export const actionUserGetAllStoryUser = (data) => ({
  type: ACTION_USER_GET_ALL_STORY_USER,
  payload: data
});
export const actionUserGetStoryUser = (data) => ({
  type: ACTION_USER_GET_STORY_USER,
  payload: data
});
export const actionUserGetFriendsHaveStory = (data) => ({
  type: ACTION_USER_GET_FRIENDS_HAVE_STORY,
  payload: data
});
export const actionUserGetTokenMessaging = (data) => ({
  type: ACTION_USER_GET_TOKEN_MESSAGING,
  payload: data
});
export const actionUserHotToast = (data) => ({
  type: ACTION_USER_HOT_TOAST,
  payload: data
});
export const actionUserBackdrop = (data) => ({
  type: ACTION_USER_BACKDROP,
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
export const actionGetAllNotifications = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'notifications'), where('receiverId', '==', id)));
  if (data.empty) {
    dispatch(actionUserGetAllNotifications([]));
  } else {
    const notifications = [];
    data.docs.forEach((notification) => {
      notifications.push({
        ...notification.data(),
        id: notification.id
      });
    });
    const notificationsSort = notifications.sort((a, b) => b.updatedAt - a.updatedAt);
    dispatch(actionUserGetAllNotifications(notificationsSort));
  }
};
export const actionGetUserSearch = (name) => async (dispatch) => {
  const data = await getDocs(collection(db, 'users'));
  const users = [];
  if (!data.empty) {
    data.docs.forEach((user) => {
      if (user.data().username.toLowerCase().includes(name)) {
        console.log(user.data());
        users.push({
          userId: user.id,
          createdAt: new Date().getTime(),
          content: user.id,
          type: 'user'
        });
      }
    });
  }
  const usersSort = users.sort((a, b) => b.createdAt - a.createdAt);
  dispatch(actionGetUserSearch(usersSort));
};
export const actionSearchAllPeople = (name, id) => async (dispatch) => {
  const data = await getDocs(collection(db, 'users'));
  const users = [];
  if (!data.empty) {
    data.docs.forEach((user) => {
      if (user.data().username.toLowerCase().includes(name.toLowerCase())) {
        users.push({
          ...user.data(),
          id: user.id
        });
      }
    });
    const userFilter = users.filter((item) => item.id !== id);
    const usersSort = userFilter.sort((a, b) => b.createdAt - a.createdAt);
    dispatch(actionUserSearchAllPeople(usersSort));
  }
};
export const actionSearchAllFriends = (name, id) => async (dispatch) => {
  const data1 = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
  );
  const data2 = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
  );
  if (data1.empty && data2.empty) {
    return dispatch(actionUserSearchAllFriend([]));
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
  const users = [];
  let count = 0;
  contacts.forEach((contact) => {
    getDoc(doc(db, 'users', contact.friendId))
      .then((snapshot) => {
        users.push({
          ...snapshot.data(),
          id: snapshot.id
        });
      })
      .then(() => {
        count += 1;
        if (count === contacts.length) {
          const userSearch = [];
          users.forEach((user) => {
            if (user.username.toLowerCase().includes(name.toLowerCase())) {
              userSearch.push(user);
            }
          });
          dispatch(actionUserSearchAllFriend(userSearch));
        }
      });
  });
};
export const actionSearchAllSent = (name, id) => async (dispatch) => {
  const data = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', false))
  );
  if (data.empty) {
    dispatch(actionUserSearchAllSent([]));
  } else {
    const users = [];
    let count = 0;
    data.docs.forEach((contact) => {
      getDoc(doc(db, 'users', contact.data().receiverId))
        .then((snapshot) => {
          users.push({
            ...snapshot.data(),
            id: snapshot.id
          });
        })
        .then(() => {
          count += 1;
          if (count === data.size) {
            const userSearch = [];
            users.forEach((user) => {
              if (user.username.toLowerCase().includes(name.toLowerCase())) {
                userSearch.push(user);
              }
            });
            dispatch(actionUserSearchAllSent(userSearch));
          }
        });
    });
  }
};
export const actionSearchAllFriendRequests = (name, id) => async (dispatch) => {
  const data = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', false))
  );
  if (data.empty) {
    dispatch(actionUserSearchAllRequests([]));
  } else {
    const users = [];
    let count = 0;
    data.docs.forEach((contact) => {
      getDoc(doc(db, 'users', contact.data().senderId))
        .then((snapshot) => {
          users.push({
            ...snapshot.data(),
            id: snapshot.id
          });
        })
        .then(() => {
          count += 1;
          if (count === data.size) {
            const userSearch = [];
            users.forEach((user) => {
              if (user.username.toLowerCase().includes(name.toLowerCase())) {
                userSearch.push(user);
              }
            });
            dispatch(actionUserSearchAllRequests(userSearch));
          }
        });
    });
  }
};
export const actionGetBadgeNotifications = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'notifications'), where('receiverId', '==', id)));
  if (data.empty) {
    dispatch(actionUserGetAllNotifications(0));
  } else {
    let count = 0;
    data.docs.forEach((notification) => {
      if (notification.data().senderIds.length > 0 && notification.data().isRead === false) {
        count += 1;
      }
    });
    dispatch(actionUserGetBadgeNotification(count));
  }
};
export const actionGetStoryUser = (id) => async (dispatch) => {
  const data = await getDocs(query(collection(db, 'stories'), where('userId', '==', id)));
  if (data.empty) {
    dispatch(actionUserGetStoryUser([]));
  } else {
    const stories = [];
    data.docs.forEach((story) => {
      if (new Date().getTime() - story.data().createdAt < 86400000) {
        stories.push({
          ...story.data(),
          id: story.id
        });
      }
    });
    const storiesSort = stories.sort((a, b) => a.createdAt - b.createdAt);
    dispatch(actionUserGetStoryUser(storiesSort));
  }
};

export const actionGetFriendsHaveStory = (id) => async (dispatch) => {
  const data1 = await getDocs(
    query(collection(db, 'contacts'), where('senderId', '==', id), where('status', '==', true))
  );
  const data2 = await getDocs(
    query(collection(db, 'contacts'), where('receiverId', '==', id), where('status', '==', true))
  );
  if (data1.empty && data2.empty) {
    return dispatch(actionUserGetFriendsHaveStory([]));
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
  const contactsStory = [];
  contacts.forEach((contact) => {
    getDocs(query(collection(db, 'stories'), where('userId', '==', contact.friendId))).then(
      (snapshots) => {
        if (!snapshots.empty) {
          snapshots.docs.forEach((snapshot) => {
            if (new Date().getTime() - snapshot.data().createdAt < 86400000) {
              if (!contactsStory.includes(contact.friendId)) {
                contactsStory.push(contact.friendId);
              }
            }
          });
        }
      }
    );
  });
  dispatch(actionUserGetFriendsHaveStory(contactsStory));
};
export const actionTestSearch = (data) => ({
  type: TEST_SEARCH,
  payload: data
});
export const actionUserBroadcastSocket = (data) => ({
  type: ACTION_USER_BROADCAST_SOCKET,
  payload: data
});
