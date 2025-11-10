import { combineReducers } from 'redux';
import postsReducer from './postsSlice';


const rootReducer = combineReducers({
  posts: postsReducer,
});

export default rootReducer;
