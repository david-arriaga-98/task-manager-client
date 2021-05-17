import {
	Nav,
	Navbar,
	NavbarBrand,
	Collapse,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import profilephoto from '../assets/images/users/1.jpg';

import logodarkicon from '../assets/images/logo-icon.png';
import logolighticon from '../assets/images/logo-light-icon.png';
import logodarktext from '../assets/images/logo-text.png';
import logolighttext from '../assets/images/logo-light-text.png';
import { IApplicationState } from '../store/ducks';
import { IUserState } from '../store/ducks/user.duck';
import { LOG_OUT } from '../store/ducks/user.duck';
import { push } from 'connected-react-router';
import { logOut } from '../utils/manageUser';

const Header = () => {
	const dispatch = useDispatch();

	const showMobilemenu = () => {
		document.getElementById('main-wrapper')?.classList.toggle('show-sidebar');
	};

	const state = useSelector<IApplicationState, IUserState>(
		(state) => state.user
	);

	const closeSession = () => {
		logOut();
		dispatch(LOG_OUT());
		dispatch(push('/login'));
	};

	return (
		<header className="topbar navbarbg" data-navbarbg="skin1">
			<Navbar className="top-navbar" color="info" dark expand="md">
				<div className="navbar-header" id="logobg" data-logobg="skin6">
					<NavbarBrand href="/dashboard">
						<b className="logo-icon">
							<img src={logodarkicon} alt="homepage" className="dark-logo" />
							<img src={logolighticon} alt="homepage" className="light-logo" />
						</b>
						<span className="logo-text">
							<img src={logodarktext} alt="homepage" className="dark-logo" />
							<img src={logolighttext} className="light-logo" alt="homepage" />
						</span>
					</NavbarBrand>
					<button
						className="btn-link nav-toggler d-block d-md-none"
						onClick={() => showMobilemenu()}
					>
						<i className="ti-menu ti-close" />
					</button>
				</div>
				{state.isLoggedIn ? (
					<Collapse className="navbarbg" navbar data-navbarbg="skin1">
						<Nav className="ml-auto float-right" navbar>
							<UncontrolledDropdown nav inNavbar>
								<DropdownToggle nav caret className="pro-pic">
									<img
										src={profilephoto}
										alt="user"
										className="rounded-circle"
										width="31"
									/>
									<span className="ml-2 text-white">
										{state.userData?.names}
									</span>
								</DropdownToggle>
								<DropdownMenu right className="user-dd">
									<DropdownItem divider />
									<DropdownItem
										onClick={closeSession}
										style={{ cursor: 'pointer' }}
									>
										<i className="fa fa-power-off mr-1 ml-1" /> Cerrar sesión
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</Nav>
					</Collapse>
				) : (
					<></>
				)}
			</Navbar>
		</header>
	);
};
export default Header;
