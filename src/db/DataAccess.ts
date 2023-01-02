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
		throw new Error('Method not implemented.');
	}

	async updatePnLValue({ userId, pnlValue }: {
		userId: string;
		pnlValue: number;
	}): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async fetchRankByUserId(userId: string): Promise<number | null> {
		throw new Error('Method not implemented.');
	}

	async fetchRankingsByRange(from: number, to: number): Promise<{
		userId: string;
		pnlValue: number;
	}[]> {
		throw new Error('Method not implemented.');
	}

	handleDatabaseError(err: any, message: string): never {
		const databaseError = new DatabaseError(message);
  		databaseError.stack = err.stack;
  		throw databaseError;
	}
}
