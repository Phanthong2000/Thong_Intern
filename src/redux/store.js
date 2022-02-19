import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import postReducer from './reducers/postReducer';
import chatReducer from './reducers/chatReducer';
import callReducer from './reducers/callReducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  chat: chatReducer,
  call: callReducer
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
