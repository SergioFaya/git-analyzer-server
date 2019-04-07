export interface IUser {
	userId?: number;
	avatarUrl?: string;
	email?: string;
	login?: string;
	type?: UserType;
}

export enum UserType {
	user = 'user',
	org = 'org',
}