export const DATABASE_CONFIG = {
	REDIS_HOST: process.env.REDIS_HOST || 'localhost',
	REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	REDIS_SORTED_SET_NAME: process.env.NODE_ENV === 'test' ? 'test-leaderboard-set' : 'leaderboard-set',
};

export const JSON_SECRET = process.env.JSON_SECRET || 'secret';

export const SERVER_CONFIG = {
	PORT: 3000,
};

export const RESULTS_PER_PAGE = 50;
