import React from 'react';
import PropTypes from 'prop-types';
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';

ThemeConfig.prototype = {
  children: PropTypes.node
};
const ThemeConfig = ({ children }) => {
  const theme = createTheme({});

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeConfig;
