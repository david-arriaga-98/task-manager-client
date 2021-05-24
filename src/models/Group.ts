import { IGetTask } from './Task';

export interface ICreateGroup {
	name: string;
	description: string;
}

export interface IGetGroup {
	id: number;
	name: string;
	description: string;
	createdAt: Date;
	ownerId: number;
	ownerName: string;
}

export interface IGetGroupById {
	id: number;
	name: string;
	description: string;
	createdAt: Date;
	franchiseId: number;
	franchiseName: string;
	totalTasks: number;
	delayedTasks: number;
	completedTasks: number;
	pendingTasks: number;
	tasks: IGetTask[];
}
