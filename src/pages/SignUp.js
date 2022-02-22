import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignForm';

function SignUp() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    window.document.title = 'Sign up';
    if (isLoggedIn) navigate('/home');
    return () => null;
  }, []);
  return <SignUpForm />;
}

export default SignUp;
