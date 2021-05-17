import { Context, FC, useEffect } from 'react';
import { ReactReduxContextValue, useDispatch, useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router';
import { History } from 'history';
import ReactNotification, { store } from 'react-notifications-component';

import Login from './pages/Login';
import Session from './components/Session';
import NotFound from './pages/404';
import MainLayout from './components/Layouts/MainLayout';
import { IApplicationState } from './store/ducks';
import {
	CLEAN_NOTIFICATION,
	INotificationState
} from './store/ducks/notification.duck';

type AppProps = {
	history: History;
	context: Context<ReactReduxContextValue>;
};

const App: FC<AppProps> = ({ history, context }) => {
	const state = useSelector<IApplicationState, INotificationState>(
		(state) => state.notification
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (state.message && state.type) {
			store.addNotification({
				title: state.type === 'error' ? 'Error!' : 'Correcto!',
				message: state.message,
				type: state.type === 'error' ? 'danger' : 'success',
				insert: 'top',
				container: 'top-right',
				animationIn: ['animate__animated', 'animate__fadeIn'],
				animationOut: ['animate__animated', 'animate__fadeOut'],
				dismiss: {
					duration: 2500,
					showIcon: true
				}
			});
			dispatch(CLEAN_NOTIFICATION());
		}
	}, [state.message, state.type, dispatch]);

	return (
		<ConnectedRouter history={history} context={context}>
			<ReactNotification />

			<Switch>
				<Session exact path="/login" component={Login} type="dontNeedSession" />
				<Session path="/" component={MainLayout} type="needSession" />
				<Session exact path="*" component={NotFound} type="freeState" />
			</Switch>
		</ConnectedRouter>
	);
};

export default App;
