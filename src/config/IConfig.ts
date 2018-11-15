export interface Config {
	app: AppConfig;
	db: DbConfig;
	oauth: OauthConfig;
}

interface AppConfig {
	port: number;
	source: string;
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