import { IDataAccess } from '../IDataAccess';
import { DATABASE_CONFIG } from '../config';
import Redis from 'ioredis';
import DatabaseError from '../common/errors/DatabaseError';
import DbConnection from './DbConnection';

export default class DataAccess implements IDataAccess {
	private redis: Redis;

	constructor(dbConnection?: DbConnection) {
		this.redis = dbConnection ? dbConnection.redis : (new DbConnection()).redis;
	}

	async insertPnLValue({ userId, pnlValue }: {
		userId: string;
		pnlValue: number;
	}): Promise<void> {
		try {
			await this.redis.zadd(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, pnlValue, userId);
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to insert pnl value into db');
		}
	}
	
	async fetchPnLValue(userId: string): Promise<number | null> {
		try {
			const pnlValue = await this.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, userId);
			if (!pnlValue) return null;
			return parseFloat(pnlValue);
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to fetch pnl value from db');
		}
	}

	async updatePnLValue({ userId, pnlValue }: {
		userId: string;
		pnlValue: number;
	}): Promise<void> {
		try {
			await this.redis.zadd(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, pnlValue, userId);
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to update pnl value into db');
		}
	}

	async fetchRankByUserId(userId: string): Promise<number | null> {
		try {
			const rank = await this.redis.zrevrank(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, userId);
			if (!rank) return null;
			return rank + 1;
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to fetch rank by userId from db');
		}
	}

	async fetchRankingsByRange(from: number, to: number): Promise<{
		userId: string;
		pnlValue: number;
	}[]> {
		try {
			const result = await this.redis.zrevrange(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, from - 1, to - 1, 'WITHSCORES');
			return result.reduce((a: any, c, i) => {
				const idx = Math.floor(i / 2);
				if (i % 2) {
					a[idx].pnlValue = parseFloat(c);
				} else {
					a[idx] = { userId: c };
				}
				return a;
			}, []);
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to fetch rankings by range from db');
		}
	}

	async fetchUsernamesByUserIds(userIds: string[]): Promise<{ [userId: string] : string | null }> {
		try {
			const result = await this.redis.mget(...userIds);
			return Object.fromEntries(result.map((username, i) => [userIds[i], username]));
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to fetch usernames by userIds from db');
		}
	}

	async countTotalPnLEntries(): Promise<number> {
		try {
			const result = await this.redis.zcount(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, -Infinity, +Infinity);
			console.log(typeof result);
			console.log(result);
			return result;
		} catch (err: any) {
			this.handleDatabaseError(err, 'Failed to count total PnL entries in db');
		}
	}

	handleDatabaseError(err: any, message: string): never {
		const databaseError = new DatabaseError(message);
		databaseError.stack = err.stack;
		throw databaseError;
	}
}
