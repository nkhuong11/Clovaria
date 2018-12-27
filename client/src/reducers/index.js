import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import getDataReducer from './getDataReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    data: getDataReducer, 
});