import axios from 'axios';
import { store } from '../index';

const Axios = axios.create({
	baseURL: 'https://taskmanager0999.herokuapp.com'
});

Axios.interceptors.request.use((req) => {
	const state = store.getState();

	if (state.user.isLoggedIn) {
		req.headers['authorization'] = 'Bearer ' + state.user.userData?.token;
	}

	return req;
});

export default Axios;
