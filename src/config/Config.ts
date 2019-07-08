/**
 * Defines the configuration file model
 */
export interface Config {
	app: AppConfig;
	db: DbConfig;
	oauth: OauthConfig;
	redis: RedisConfig;
	services: ServicesConfig;
}

/**
 * Redis-related configuration
 */
interface RedisConfig {
	port: number;
}

/**
 * Chart-related configuration
 */
interface ChartsConfig {
	logOptions: string[];
}

/**
 * Genearl application configuration 
 */
interface AppConfig {
	port: number;
	source: string;
	tokenSecret: string;
	repositoryFilesPath: string;
	chartsConfig: ChartsConfig;
}

/**
 * Database configuration 
 */
interface DbConfig {
	host: string;
	port: number;
	name: string;
	collections: CollectionsConfig;
	queries: Array<[string, object]>;
}

/**
 * Database collection configuration
 */
interface CollectionsConfig {
	commits: string;
	users: string;
}

/**
 * Integration configuration with the OAuth System
 */
interface OauthConfig {
	client_id: string;
	client_secret: string;
	state: string;
	scope: string;
	userAgent: string;
}

/**
 * Services configuration
 */
interface ServicesConfig {
	auth: ServiceAuth;
}

/**
 * Configuration of the authentication server
 */
interface ServiceAuth {
	baseUrl: string;
}