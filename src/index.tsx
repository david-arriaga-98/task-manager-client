import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import App from './App';
import Store, { history } from './store';

import './assets/scss/style.css';
import 'react-notifications-component/dist/theme.css';

export const store = Store();

ReactDOM.render(
	<Provider store={store} context={ReactReduxContext}>
		<App history={history} context={ReactReduxContext} />
	</Provider>,
	document.getElementById('root')
);
