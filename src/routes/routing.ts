import Dashboard from '../pages/DashBoard';
import Franchise from '../pages/Franchise';
import Group from '../pages/Group';
import Task from '../pages/Task';
import User from '../pages/User';

var ThemeRoutes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'ti-loop',
		component: Dashboard,
		scope: 'ALL'
	},
	{
		path: '/users',
		name: 'Usuarios',
		icon: 'ti-user',
		component: User,
		scope: 'ADMIN'
	},
	{
		path: '/franchises',
		name: 'Franquicias',
		icon: 'ti-home',
		component: Franchise,
		scope: 'ADMIN'
	},
	{
		path: '/groups',
		name: 'Grupos',
		icon: 'ti-layers',
		component: Group,
		scope: 'USER'
	},
	{
		path: '/tasks',
		name: 'Tareas',
		icon: 'ti-panel',
		component: Task,
		scope: 'USER'
	},

	{ path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true }
];
export default ThemeRoutes;
