import { useState, useEffect } from 'react';
import { Route } from 'react-router';
import Header from '../Header';
import Sidebar from '../Sidebar';
import ThemeRoutes from '../../routes/routing';
import Footer from '../Footer';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../store/ducks';
import { push } from 'connected-react-router';

const MainLayout = (props: any) => {
	const [width, setWidth] = useState<number>(window.innerWidth);

	const dispatch = useDispatch();
	const state = useSelector<IApplicationState, IApplicationState>(
		(state) => state
	);

	props.history.listen(() => {
		if (
			window.innerWidth < 767 &&
			document
				.getElementById('main-wrapper')
				?.className.indexOf('show-sidebar') !== -1
		) {
			document.getElementById('main-wrapper')?.classList.toggle('show-sidebar');
		}
	});

	useEffect(() => {
		const updateDimensions = () => {
			let element = document.getElementById('main-wrapper');
			setWidth(window.innerWidth);
			if (width < 1170) {
				element?.setAttribute('data-sidebartype', 'mini-sidebar');
				element?.classList.add('mini-sidebar');
			} else {
				element?.setAttribute('data-sidebartype', 'full');
				element?.classList.remove('mini-sidebar');
			}
		};
		if (document.readyState === 'complete') {
			updateDimensions();
		}
		window.addEventListener('resize', updateDimensions.bind(this));
		window.addEventListener('load', updateDimensions.bind(this));
		return () => {
			window.removeEventListener('load', updateDimensions.bind(this));
			window.removeEventListener('resize', updateDimensions.bind(this));
		};
	}, [width]);

	useEffect(() => {
		if (state.router.location.pathname === '/') {
			state.user.userData?.role === 'ADMIN'
				? dispatch(push('/users'))
				: dispatch(push('/groups'));
		}
	}, [dispatch, state.router.location.pathname, state.user.userData?.role]);

	return (
		<div
			id="main-wrapper"
			data-theme="light"
			data-layout="vertical"
			data-sidebartype="full"
			data-sidebar-position="fixed"
			data-header-position="fixed"
			data-boxed-layout="full"
		>
			<Header />
			<Sidebar {...props} routes={ThemeRoutes} />
			<div className="page-wrapper d-block">
				<div className="page-content container-fluid">
					{ThemeRoutes.map((prop, key) => {
						if (prop.scope === state.user.userData?.role) {
							return (
								<Route
									exact
									path={prop.path}
									component={prop.component}
									key={key}
								/>
							);
						}
						return null;
					})}
				</div>
				<Footer />
			</div>
		</div>
	);
};

export default MainLayout;
