import { Nav } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { IApplicationState } from '../store/ducks';
import { IUserState } from '../store/ducks/user.duck';

const Sidebar = (props: any) => {
	const expandLogo = () => {
		document.getElementById('logobg')?.classList.toggle('expand-logo');
	};

	const state = useSelector<IApplicationState, IUserState>(
		(state) => state.user
	);

	const dispatch = useDispatch();

	const activeRoute = (routeName: any) => {
		return props.location.pathname.indexOf(routeName) > -1 ? 'selected' : '';
	};

	return (
		<aside
			className="left-sidebar"
			id="sidebarbg"
			data-sidebarbg="skin6"
			onMouseEnter={expandLogo.bind(null)}
			onMouseLeave={expandLogo.bind(null)}
		>
			<div className="scroll-sidebar">
				<PerfectScrollbar className="sidebar-nav">
					<Nav id="sidebarnav">
						{props.routes.map((prop: any, key: number) => {
							if (prop.redirect) {
								return null;
							} else {
								if (
									prop.scope === state.userData?.role ||
									prop.scope === 'ALL'
								) {
									return (
										<li
											className={
												activeRoute(prop.path) +
												(prop.pro ? ' active active-pro' : '') +
												' sidebar-item'
											}
											key={key}
										>
											<span
												onClick={() => {
													dispatch(push(prop.path));
												}}
												className="sidebar-link"
											>
												<i className={prop.icon} />
												<span className="hide-menu">{prop.name}</span>
											</span>
										</li>
									);
								}
							}
						})}
					</Nav>
				</PerfectScrollbar>
			</div>
		</aside>
	);
};
export default Sidebar;
