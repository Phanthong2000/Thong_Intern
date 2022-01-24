import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function Login() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    window.document.title = 'Login';
    if (isLoggedIn) navigate('/home');
  }, []);
  return <LoginForm />;
}

export default connect()(Login);
