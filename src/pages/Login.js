import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/material';
import LoginForm from '../components/LoginForm';

const RootStyle = styled(Box)(({ theme }) => ({
  // background: 'red'
}));
function Login({ children }) {
  return <LoginForm />;
}

Login.prototype = {
  children: PropTypes.node
};

export default Login;
