import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import postReducer from './reducers/postReducer';
import chatReducer from './reducers/chatReducer';
import callReducer from './reducers/callReducer';
import groupReducer from './reducers/groupReducer';
import pageReducer from './reducers/pageReducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  chat: chatReducer,
  call: callReducer,
  group: groupReducer,
  page: pageReducer
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
