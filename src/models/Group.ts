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
