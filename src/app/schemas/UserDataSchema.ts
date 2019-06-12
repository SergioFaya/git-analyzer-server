import { IUserData, UserType } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';

export class UserData extends Typegoose implements IUserData {

	@prop({ required: true, index: true })
	public id?: number;
	@prop({ required: true })
	public username?: string;
	@prop({ required: true })
	public login?: string;
	@prop({ required: true })
	public email?: string;
	@prop({ required: true })
	public imageUrl?: string;
	@prop({ required: true })
	public type?: UserType;
	@prop({ required: true })
	public name?: string;

	constructor(id?: number, username?: string, login?: string, email?: string, imageUrl?: string, type?: UserType, name?: string) {
		super();
		this.id = id;
		this.username = username;
		this.login = login;
		this.email = email;
		this.imageUrl = imageUrl;
		this.type = type;
		this.name = name;
	}
}

export const UserDataModel = new UserData().getModelForClass(UserData, {
	schemaOptions: { collection: 'users' }
});
