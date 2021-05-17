import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import User, { IUserState } from './user.duck';
import Notification, { INotificationState } from './notification.duck';

export interface IAction<T, K> {
	type: T;
	payload?: K;
}

export interface IApplicationState {
	router: any;
	user: IUserState;
	notification: INotificationState;
}

const rootReducer = (history: History) => {
	return combineReducers<IApplicationState>({
		router: connectRouter(history),
		user: User,
		notification: Notification
	});
};

export default rootReducer;
