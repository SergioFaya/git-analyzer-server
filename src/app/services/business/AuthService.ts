/**
 * Defines an interface for the authentication service
 */
export default interface AuthService {
	auth(token: string): Promise<any>;
}