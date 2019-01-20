export interface Config {
	app: AppConfig;
	db: DbConfig;
	oauth: OauthConfig;
	redis: RedisConfig;
}

interface RedisConfig {
	port: number;
}

interface AppConfig {
	port: number;
	source: string;
	tokenSecret: string;
}

interface DbConfig {
	host: string;
	port: number;
	name: string;
	collections: CollectionsConfig;
	queries: Array<[string, object]>;
}

interface CollectionsConfig {
	commits: string;
	users: string;
}

interface OauthConfig {
	client_id: string;
	client_secret: string;
	state: string;
	scope: string;
	userAgent: string;
}