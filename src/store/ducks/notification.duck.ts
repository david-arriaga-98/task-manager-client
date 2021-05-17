import { IAction } from '.';

export enum NotificationOptions {
	SHOW_NOTIFICATION = '@@notification/SHOW_NOTIFICATION',
	CLEAN_NOTIFICATION = '@@notification/CLEAN_NOTIFICATION'
}

type messageType = 'error' | 'success';

export interface INotificationState {
	type?: messageType;
	message?: string;
}

let initialState: INotificationState = {
	type: undefined,
	message: undefined
};

const reducer = (
	state = initialState,
	{ type, payload }: IAction<NotificationOptions, INotificationState>
): INotificationState => {
	switch (type) {
		case NotificationOptions.SHOW_NOTIFICATION:
			return {
				...state,
				type: payload?.type,
				message: payload?.message
			};
		case NotificationOptions.CLEAN_NOTIFICATION:
			return {
				...state,
				type: undefined,
				message: undefined
			};
		default:
			return state;
	}
};

export const SHOW_NOTIFICATION = (data: INotificationState) => ({
	type: NotificationOptions.SHOW_NOTIFICATION,
	payload: data
});

export const CLEAN_NOTIFICATION = () => ({
	type: NotificationOptions.CLEAN_NOTIFICATION
});

export default reducer;
