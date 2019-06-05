export interface Config {
	app: AppConfig;
	db: DbConfig;
	oauth: OauthConfig;
	redis: RedisConfig;
	res: ResConfig;
	services: ServicesConfig;
}

interface RedisConfig {
	port: number;
}

interface ResConfig {
	public_key: string;
	private_key: string;
}

interface ChartsConfig {
	logOptions: string[];
}

interface AppConfig {
	port: number;
	source: string;
	tokenSecret: string;
	repositoryFilesPath: string;
	chartsConfig: ChartsConfig;
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

interface ServicesConfig {
	auth: ServiceAuth;
}

interface ServiceAuth {
	baseUrl: string;
}