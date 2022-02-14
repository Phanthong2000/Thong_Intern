import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const scrollTop = useSelector((state) => state.user.scrollTop);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, scrollTop]);

  return null;
}
