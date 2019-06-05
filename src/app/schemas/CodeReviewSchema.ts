import { ICodeReview, IUserData } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';

export class CodeReview extends Typegoose implements ICodeReview {

	@prop({ index: true, required: true })
	public id?: number;
	@prop({ required: true })
	public title?: string;
	@prop({ required: true })
	public created_at?: Date;
	@prop({ required: true })
	public created_by?: IUserData;
	@prop({ required: true })
	public commentary?: string;
	@prop({ required: true })
	public calification?: number;

	constructor(title?: string, created_at?: Date, created_by?: IUserData, commentary?: string, calification?: number) {
		super();
		this.title = title;
		this.created_at = created_at;
		this.created_by = created_by;
		this.commentary = commentary;
		this.calification = calification;
	}
}

export const CodeReviewModel = new CodeReview().getModelForClass(CodeReview);