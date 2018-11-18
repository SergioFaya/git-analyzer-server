import { prop, Typegoose } from 'typegoose';
import { IUser, UserType } from '../User';

export default class User extends Typegoose implements IUser {
	@prop()
	public login: string;
	@prop()
	// tslint:disable-next-line:variable-name
	public avatar_url: string;
	@prop()
	public type: UserType;
	@prop()
	public email: string;

	// tslint:disable-next-line:variable-name
	constructor(login?: string, avatar_url?: string, type?: UserType, email?: string) {
		super();
		this.login = login;
		this.avatar_url = avatar_url;
		this.type = type;
		this.email = email;
	}

}