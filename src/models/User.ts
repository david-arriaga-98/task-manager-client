import { IFranchise } from './Franchise';

export interface IGetUser {
	id: number;
	names: string;
	username: string;
	email: string;
	role: string;
	createdAt: Date;
	franchise: IFranchise | null;
}

export interface ILogin {
	credential: string;
	password: string;
}

export interface IUser {
	id: number;
	names: string;
	role: string;
	franchise: IFranchise | null;
	token: string;
}

export interface IRegister {
	names: number;
	role: string;
	username: string;
	email: string;
	password: string;
	passwordConfirm: string;
}
