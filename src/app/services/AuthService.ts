export default interface AuthService {
	auth(token: string): Promise<any>;
}