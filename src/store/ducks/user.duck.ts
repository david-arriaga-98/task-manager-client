import { IAction } from './';
import { currentUser } from '../../utils/manageUser';
import { IUser } from '../../models/User';

export enum UserOptions {
	START_LOGIN = '@@user/START_LOGIN',
	SUCCESS_LOGIN = '@@user/SUCCESS_LOGIN',
	ERROR_LOGIN = '@@user/ERROR_LOGIN',
	LOG_OUT = '@@user/LOG_OUT'
}

export interface IUserState {
	isLoggedIn: boolean;
	isLoading: boolean;
	isError: boolean;
	errorMessage?: string;
	userData?: IUser;
}

export interface IUserPayload {
	userData?: IUser;
	errorMessage?: string;
}

const user = currentUser();

const appState: boolean = user === undefined ? false : true;

let initialState: IUserState = {
	isLoggedIn: appState,
	isLoading: false,
	isError: false,
	userData: user,
	errorMessage: undefined
};

const reducer = (
	state = initialState,
	{ type, payload }: IAction<UserOptions, IUserPayload>
): IUserState => {
	switch (type) {
		case UserOptions.START_LOGIN:
			return {
				...state,
				isError: false,
				isLoading: true,
				isLoggedIn: false
			};
		case UserOptions.SUCCESS_LOGIN:
			return {
				...state,
				isError: false,
				isLoading: false,
				isLoggedIn: true,
				userData: payload?.userData
			};
		case UserOptions.ERROR_LOGIN:
			return {
				...state,
				errorMessage: payload?.errorMessage,
				isError: true,
				isLoading: false,
				isLoggedIn: false,
				userData: undefined
			};
		case UserOptions.LOG_OUT:
			return {
				...state,
				errorMessage: undefined,
				isError: false,
				isLoading: false,
				isLoggedIn: false,
				userData: undefined
			};
		default:
			return state;
	}
};

export const START_LOGIN = () => ({
	type: UserOptions.START_LOGIN
});
export const SUCCESS_LOGIN = (data: IUserPayload) => ({
	type: UserOptions.SUCCESS_LOGIN,
	payload: data
});
export const ERROR_LOGIN = (data: IUserPayload) => ({
	type: UserOptions.ERROR_LOGIN,
	payload: data
});
export const LOG_OUT = () => ({
	type: UserOptions.LOG_OUT
});

export default reducer;
