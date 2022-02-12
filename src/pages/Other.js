import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

Other.prototype = {
  user: PropTypes.object
};
function Other({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (id === user.id) navigate(`/home/profile/${user.id}`);
  }, [user]);
  return <div style={{ marginTop: '200px' }}>{user.id}</div>;
}

export default Other;
