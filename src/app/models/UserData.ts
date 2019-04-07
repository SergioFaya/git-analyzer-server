export default interface UserData {
	id: number | undefined;
	username: string | undefined;
	login: string | undefined;
	email: string | undefined;
	imageUrl: string | undefined;
	type: UserType | undefined;
	name: string | undefined;
}

enum UserType {
	Org = 'Org',
	User = 'User',
}