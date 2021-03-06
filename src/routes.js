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
import VideoRoom2 from './pages/VideoRoom2';
import VideoRoom from './pages/VideoRoom';
import Feed from './components/group/Feed';
import CreateGroup from './components/group/CreateGroup';
import Group from './components/group/Group';
import GroupPage from './pages/Group';
import YourFeed from './components/group/YourFeed';
import Discover from './components/group/Discover';
import YourNotifications from './components/group/YourNotifications';
import Page from './pages/Page';
import CreatePage from './components/page/CreatePage';
import YourPage from './components/page/YourPage';
import PageUser from './components/page/Page';
import Invites from './components/page/Invites';
import LikedPages from './components/page/LikedPages';
import DiscoverPage from './components/page/Discover';
import PostNotification from './pages/PostNotification';
import All from './components/search/All';
import Pages from './components/search/Pages';
import Groups from './components/search/Groups';

function Router() {
  const user = useSelector((state) => state.user.user);
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
        { path: 'video-call', element: <VideoCall /> },
        {
          path: 'friends',
          element: <Friends />,
          children: [
            { path: 'friend-requests', element: <FriendRequests /> },
            { path: 'all-friends', element: <AllFriends /> },
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
        {
          path: 'pages',
          element: <Page user={user} />,
          children: [
            { path: 'your-page/:id', element: <YourPage user={user} /> },
            { path: 'discover', element: <DiscoverPage user={user} /> },
            { path: 'liked-pages', element: <LikedPages user={user} /> },
            { path: 'invites', element: <Invites user={user} /> }
          ]
        },
        { path: 'pages/:id', element: <PageUser user={user} /> },
        { path: 'pages/create-page', element: <CreatePage user={user} /> },
        { path: 'other/:id', element: <Other user={user} /> },
        { path: 'profile/:id', element: <Profile user={user} /> },
        { path: 'room/:id', element: <Room user={user} /> },
        { path: 'video-room/:roomId', element: <VideoRoom2 user={user} /> },
        { path: 'photo/:id', element: <Photo user={user} /> },
        { path: 'post/:id', element: <PostNotification /> },
        {
          path: 'search',
          element: <Search />,
          children: [
            { path: 'all/:name', element: <All user={user} /> },
            { path: 'people/:name', element: <AllPeople user={user} /> },
            { path: 'pages/:name', element: <Pages user={user} /> },
            { path: 'groups/:name', element: <Groups user={user} /> },
            { element: <Navigate to="/home/search/all/:name" /> }
          ]
        },
        {
          path: 'stories',
          element: <Story />
        },
        { path: 'create-story', element: <CreateStory /> },
        {
          path: 'user-not-found',
          element: <UserNotFound />
        },
        {
          path: 'groups',
          element: <GroupPage />,
          children: [
            { element: <Navigate to="/home/groups/feed" /> },
            {
              path: 'feed',
              element: <Feed user={user} />,
              children: [
                { path: 'your-feed', element: <YourFeed user={user} /> },
                { path: 'discover', element: <Discover user={user} /> },
                { path: 'notifications', element: <YourNotifications user={user} /> },
                { element: <Navigate to="/home/groups/feed/your-feed" /> }
              ]
            },
            { path: 'create-group', element: <CreateGroup user={user} /> },
            { path: ':id', element: <Group user={user} /> }
          ]
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
