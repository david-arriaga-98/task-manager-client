import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { IApplicationState } from '../store/ducks/index';
import { IUserState } from '../store/ducks/user.duck';

type PageType = 'needSession' | 'dontNeedSession' | 'freeState';

type SessionProps = {
	component?: any;
	path: string;
	exact?: boolean;
	type: PageType;
};

const Session: FC<SessionProps> = (props) => {
	const { component: Component } = props;

	const store = useSelector<IApplicationState, IUserState>(
		(state) => state.user
	);

	const applicationState = store.isLoggedIn && store.userData !== undefined;

	return props.type === 'needSession' ? (
		<Route
			render={(prop) =>
				applicationState ? <Component {...prop} /> : <Redirect to="/login" />
			}
		/>
	) : props.type === 'dontNeedSession' ? (
		<Route
			render={(prop) =>
				applicationState ? <Redirect to="/" /> : <Component {...prop} />
			}
		/>
	) : (
		<Route render={(prop) => <Component {...prop} />} />
	);
};

export default Session;
