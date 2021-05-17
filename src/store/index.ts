import { createStore, applyMiddleware, compose } from 'redux';
import { logger } from 'redux-logger';
import { createBrowserHistory, History } from 'history';
import { routerMiddleware } from 'connected-react-router';

import rootReducer from './ducks';

export const history: History = createBrowserHistory();

const store = () => {
	return {
		...createStore(
			rootReducer(history),
			compose(applyMiddleware(routerMiddleware(history), logger))
		)
	};
};

export default store;
