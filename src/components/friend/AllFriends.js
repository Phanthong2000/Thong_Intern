import React from 'react';
import PropTypes from 'prop-types';

AllFriends.prototype = {
  user: PropTypes.object
};
function AllFriends({ user }) {
  return <div>{user.id}</div>;
}

export default AllFriends;
