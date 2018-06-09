import { combineReducers } from 'redux';
import appReducer from './appReducer';
import clockReducer from './clockReducer';
import weatherReducer from './weatherReducer';
import dialogReducer from './dialogReducer';

export default combineReducers({
	appReducer,
	clockReducer,
	weatherReducer,
	dialogReducer,
});
