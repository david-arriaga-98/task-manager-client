import axios from './axios';
import { AxiosRequestConfig, Method } from 'axios';

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
	data?: T,
	config?: AxiosRequestConfig
): Promise<ISuccessResponse<K>> => {
	try {
		const configuration: AxiosRequestConfig = {
			...config,
			method,
			url,
			data
		};
		const response = await axios.request(configuration);
		return response.data as ISuccessResponse<K>;
	} catch (error) {
		throw error;
	}
};
