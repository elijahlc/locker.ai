import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import auth from './auth';
import shoes from './shoes';
import * as process from 'process';
import logger from 'redux-logger';

const env = process.env.NODE_ENV;

const reducer = combineReducers({
	auth,
	shoes,
});

const middlewares = [thunk];

if (env === 'development') {
	middlewares.push(logger);
}
const store = createStore(reducer, applyMiddleware(...middlewares));

export default store;

export * from './auth';
export * from './shoes';
