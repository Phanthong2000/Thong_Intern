import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { actionChatInputting } from '../redux/actions/chatAction';

// ----------------------------------------------------------------------

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const scrollTop = useSelector((state) => state.user.scrollTop);
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => null;
  }, [pathname, scrollTop]);

  return null;
}
