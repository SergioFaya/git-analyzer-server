export interface IUser {
	avatar_url: string;
	email: string;
	login: string;
	type: UserType;
}

export enum UserType {
	user,
	org,
}