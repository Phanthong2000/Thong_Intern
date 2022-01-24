import React from 'react';
import { useRoutes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Login from './pages/Login';

function Router() {
  return useRoutes([
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
      element: <Home />
    }
  ]);
}

export default Router;
