import axios from './axios';
import { Method } from 'axios';

export interface ISuccessResponse<T> {
	status: string;
	code: number;
	message: string;
	data: T;
}

export interface IErrorResponse {
	status: string;
	code: number;
	message: string;
}

export const executeServerPetition = async <T, K>(
	method: Method,
	url: string,
	params?: T
): Promise<ISuccessResponse<K>> => {
	try {
		const response = await axios.request({
			method,
			url,
			data: params
		});
		return response.data as ISuccessResponse<K>;
	} catch (error) {
		throw error;
	}
};
