import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

let enhancers;
if (process.env.NODE_ENV === "development" && devTools) {
	enhancers = compose(applyMiddleware(...middleware), devTools);
} else {
	enhancers = compose(applyMiddleware(...middleware));
}

const store = createStore(
	rootReducer,
	initialState,
	enhancers
);

export default store;
