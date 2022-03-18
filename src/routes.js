import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Login from './pages/Login';
import HomeLayout from './layouts/HomeLayout';
import Chat from './pages/Chat';
import Friends from './pages/Friends';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import Error from './pages/Error';
import UserNotFound from './components/profile/UserNotFound';
import Other from './pages/Other';
import FriendRequests from './components/friend/FriendRequests';
import AllFriends from './components/friend/AllFriends';
import VideoCall from './pages/VideoCall';
import Photo from './pages/Photo';
import Search from './pages/Search';
import AllPeople from './components/search/AllPeople';
import AllSent from './components/search/AllSent';
import AllRequests from './components/search/AllRequests';
import AllFriendsSearch from './components/search/AllFriends';
import Story from './pages/Story';
import CreateStory from './components/story/CreateStory';
import ProfileSetting from './components/setting/ProfileSetting';
import PasswordSetting from './components/setting/PasswordSetting';
import ForgotPassword from './pages/ForgotPassword';
import Room from './pages/Room';

function Router() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [user, setUser] = useState({});
  const getUser = async (userId) => {
    const data = await getDoc(doc(db, 'users', userId));
    setUser({
      ...data.data(),
      id: data.id
    });
  };
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
    if (localStorage.getItem('user') !== null) {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      getUser(userId);
    }
    return () => null;
  }, []);
  return useRoutes([
    { path: '/', element: <Navigate to="/login" /> },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/home',
      element: <HomeLayout />,
      children: [
        { element: <Navigate to="/home/app" replace /> },
        { path: 'app', element: <Home user={user} /> },
        { path: 'chat', element: <Chat user={user} /> },
        { path: 'video-call', element: <VideoCall user={user} /> },
        {
          path: 'friends',
          element: <Friends user={user} />,
          children: [
            { path: 'friend-requests', element: <FriendRequests user={user} /> },
            { path: 'all-friends', element: <AllFriends user={user} /> },
            { element: <Navigate to="/home/friends/friend-requests" /> }
          ]
        },
        {
          path: 'setting',
          element: <Setting user={user} />,
          children: [
            { path: 'profile-setting', element: <ProfileSetting user={user} /> },
            { path: 'password-setting', element: <PasswordSetting user={user} /> },
            { element: <Navigate to="/home/setting/profile-setting" /> }
          ]
        },
        { path: 'other/:id', element: <Other user={user} /> },
        { path: 'profile/:id', element: <Profile user={user} /> },
        { path: 'room/:id', element: <Room user={user} /> },
        { path: 'photo/:id', element: <Photo user={user} /> },
        {
          path: 'search',
          element: <Search user={user} />,
          children: [
            { path: 'all-people/:name', element: <AllPeople user={user} /> },
            { path: 'all-friends/:name', element: <AllFriendsSearch user={user} /> },
            { path: 'all-sent/:name', element: <AllSent user={user} /> },
            { path: 'all-requests/:name', element: <AllRequests user={user} /> },
            { element: <Navigate to="/home/search/all-people/:name" /> }
          ]
        },
        {
          path: 'stories',
          element: <Story user={user} />
        },
        { path: 'create-story', element: <CreateStory user={user} /> },
        {
          path: 'user-not-found',
          element: <UserNotFound />
        }
      ]
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/error',
      element: <Error />
    },
    {
      path: '/*',
      element: <Navigate to="/error" />
    }
  ]);
}

export default Router;
