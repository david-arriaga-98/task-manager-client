export interface ICreateTask {
	name: string;
	description: string;
	endTaskDate: Date;
	groupId: number;
}

export interface IGetTask {
	id: number;
	name: string;
	description: string;
	status: string;
	endTask: Date;
	createdAt: Date;
	updatedAt: Date;
	users: number;
	isJoinInTask: number;
}

export interface IGetTaskFromUser extends IGetTask {
	groupId: number;
	groupName: string;
}
