import { RedisClient } from "redis";

interface Chart {
	data: any[];
	colors: IColor[];
}

interface IColor {
	getColorString: () => string;
}

class Color implements Color {

	private red: number;
	private green: number;
	private blue: number;

	public getColorString(): string {

		return '';
	}
}
const color = new Color();