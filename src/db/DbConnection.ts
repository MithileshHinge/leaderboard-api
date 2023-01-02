import Redis from "ioredis";
import { DATABASE_CONFIG } from "../config";

export default class DbConnection {
	public redis: Redis;

	constructor() {
		this.redis = new Redis({
			port: DATABASE_CONFIG.REDIS_PORT,
			host: DATABASE_CONFIG.REDIS_HOST,
			password: DATABASE_CONFIG.REDIS_PASSWORD,
		});
	}

	async close() {
		await this.redis.quit();
	}
}
