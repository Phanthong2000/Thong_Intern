import React from 'react';
import { useSelector } from 'react-redux';

function FileMessage({ test }) {
  const sendMessage = useSelector((state) => state.chat.sendMessage);
  if (test !== '') return <div>{sendMessage}</div>;
  return <div>FileMessage</div>;
}

export default FileMessage;
