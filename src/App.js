import React, { useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Router from './routes';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import { connectWithSocket } from './utils/wssConnection';

function App() {
  useEffect(() => {
    connectWithSocket();
  }, []);
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <Router />
    </ThemeConfig>
  );
}

export default App;
