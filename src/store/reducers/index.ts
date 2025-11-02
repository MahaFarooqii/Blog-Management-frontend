import { combineReducers } from 'redux';
import analyticsReducer from './analyticsSlice';
import tasksReducer from './tasksSlice'
import projectsReducer from './projectsSlice'


const rootReducer = combineReducers({
  analytics: analyticsReducer,
  tasks: tasksReducer,
  projects: projectsReducer
});

export default rootReducer;
