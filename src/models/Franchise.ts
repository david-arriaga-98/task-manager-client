export interface IFranchise {
	id: number;
	name: string;
	socialReason: string;
}

export interface IGetFranchise extends IFranchise {
	createdAt: Date;
	users: number;
	groups: number;
}

export interface ICreateFranchise {
	name: string;
	socialReason: string;
}
