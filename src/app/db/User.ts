export interface IUser {
	avatarUrl: string;
	email: string;
	login: string;
	type: UserType;
}

export enum UserType {
	user = 'user',
	org = 'org',
}