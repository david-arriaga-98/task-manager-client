// import Dashboard from '../pages/DashBoard';
import Franchise from '../pages/Franchise/Fanchise';
import Group from '../pages/Group/Group';
import MyGroup from '../pages/Group/MyGroup';
import Task from '../pages/Task/Task';
import User from '../pages/User/User';

var ThemeRoutes = [
	// {
	// 	path: '/dashboard',
	// 	name: 'Dashboard',
	// 	icon: 'ti-loop',
	// 	component: Dashboard,
	// 	scope: 'ALL',
	// 	map: true
	// },
	{
		path: '/users',
		name: 'Usuarios',
		icon: 'ti-user',
		component: User,
		scope: 'ADMIN',
		map: true
	},
	{
		path: '/franchises',
		name: 'Franquicias',
		icon: 'ti-home',
		component: Franchise,
		scope: 'ADMIN',
		map: true
	},
	{
		path: '/groups/:id',
		component: MyGroup,
		scope: 'USER',
		map: false
	},
	{
		path: '/groups',
		name: 'Grupos',
		icon: 'ti-layers',
		component: Group,
		scope: 'USER',
		map: true
	},

	{
		path: '/tasks',
		name: 'Tareas',
		icon: 'ti-panel',
		component: Task,
		scope: 'USER',
		map: true
	}
];
export default ThemeRoutes;
