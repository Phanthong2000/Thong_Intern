import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import postReducer from './reducers/postReducer';
import chatReducer from './reducers/chatReducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  chat: chatReducer
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
