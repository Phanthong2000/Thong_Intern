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
        { path: 'setting', element: <Setting /> },
        { path: 'other/:id', element: <Other user={user} /> },
        { path: 'profile/:id', element: <Profile user={user} /> },
        { path: 'photo/:id', element: <Photo user={user} /> },
        {
          path: 'user-not-found',
          element: <UserNotFound />
        }
      ]
    }
    // {
    //   path: '/error',
    //   element: <Error />
    // },
    // {
    //   path: '/*',
    //   element: <Navigate to="/error" />
    // }
  ]);
}

export default Router;
