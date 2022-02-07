import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Login from './pages/Login';
import HomeLayout from './layouts/HomeLayout';
import Chat from './pages/Chat';
import RequestFriends from './pages/RequestFriends';
import Setting from './pages/Setting';
import Profile from './pages/Profile';

function Router() {
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
        { path: 'app', element: <Home /> },
        { path: 'chat', element: <Chat /> },
        { path: 'request-friends', element: <RequestFriends /> },
        { path: 'setting', element: <Setting /> },
        { path: 'profile/:id', element: <Profile /> }
      ]
    }
  ]);
}

export default Router;
