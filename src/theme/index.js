import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import typography from './typography';

export default function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      typography,
      palette: {
        background: '#f5f7f6',
        green: '#30ab78',
        button: 'linear-gradient(to right, #06beb6 0%, #48b1bf  51%, #06beb6  100%)',
        second: '#bcf7df'
      }
    }),
    []
  );
  const theme = createTheme(themeOptions);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
ThemeConfig.prototype = {
  children: PropTypes.node
};
