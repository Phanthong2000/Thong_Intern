import React from 'react';
import ScrollToTop from './components/ScrollToTop';
import Router from './routes';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';

function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <Router />
    </ThemeConfig>
  );
}

export default App;
