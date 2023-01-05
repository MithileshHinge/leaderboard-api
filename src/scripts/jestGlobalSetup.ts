import { DATABASE_CONFIG } from '../config';
import { dbConnection } from '../db';

export default async () => {
	await dbConnection.redis.del(DATABASE_CONFIG.REDIS_SORTED_SET_NAME);
};
