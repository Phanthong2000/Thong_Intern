import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actionChatGetChatbox } from '../redux/actions/chatAction';

function Setting() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      actionChatGetChatbox({
        id: '',
        user: {}
      })
    );
    return () => null;
  }, []);
  return <div>Setting</div>;
}

export default Setting;
