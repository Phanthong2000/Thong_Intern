const defaultState = {
  isLoggedIn: !!localStorage.getItem('user')
};
const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
export default userReducer;
