import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Axios from '../utils/axios';
import { ISuccessResponse } from '../utils/managePetitions';
import { SHOW_NOTIFICATION } from '../store/ducks/notification.duck';

const useDataFetch = <T>(initialUrl?: string) => {
	const [loadData, setLoadData] = useState<boolean>(false);

	const [data, setData] = useState<T | undefined>();

	const [url, setUrl] = useState<string | undefined>(initialUrl);

	const [isError, setIsError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const dispatch = useDispatch();

	const reloadState = () => {
		setIsError(false);
	};

	const doFetch = (newUrl: string) => {
		reloadState();
		setUrl(newUrl);
		setLoadData(false);
	};

	const reload = () => {
		reloadState();
		setLoadData(false);
	};

	// const loading = (state: boolean) => {
	// 	setIsLoading(state);
	// };

	useEffect(() => {
		const source = axios.CancelToken.source();
		if (!loadData && url) {
			const getData = async () => {
				try {
					setIsLoading(true);
					const response = await Axios.get<ISuccessResponse<T>>(url, {
						cancelToken: source.token
					});
					setIsLoading(false);
					setData(response.data.data);
					setLoadData(true);
				} catch (error) {
					setIsLoading(false);
					setIsError(true);
					setLoadData(true);
					dispatch(
						SHOW_NOTIFICATION({
							type: 'error',
							message: error.response.data.message
						})
					);
				}
			};
			getData();
		}
		return () => {
			source.cancel();
		};
		// eslint-disable-next-line
	}, [loadData, url]);

	const dataState: IDataFetchDataState<T> = {
		data,
		isError,
		isLoading,
		loadData
	};

	return { dataState, doFetch, reload };
};

export interface IDataFetchDataState<T> {
	isLoading: boolean;
	isError: boolean;
	loadData: boolean;
	data?: T;
}

export default useDataFetch;
