import { prop, Typegoose } from 'typegoose';
import { IUser, UserType } from './types/User';

export class User extends Typegoose implements IUser {
	@prop({ required: true, index: true })
	public userId: number;
	@prop({ required: true })
	public login: string;
	@prop({ required: true })
	// tslint:disable-next-line:variable-name
	public avatarUrl: string;
	@prop({ required: true })
	public type: UserType;
	@prop({ required: true })
	public email: string;

	// tslint:disable-next-line:variable-name
	constructor(userId?: number, login?: string, avatar_url?: string, type?: UserType, email?: string) {
		super();
		this.userId = userId;
		this.login = login;
		this.avatarUrl = avatar_url;
		this.type = type;
		this.email = email;
	}
}

export const userModel = new User().getModelForClass(User);