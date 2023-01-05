/**
 * Script to populate sample data into redis (userId-PnL in sorted set and userId-username as key-value store)
 */
import { faker } from '@faker-js/faker';
import { forEachAsync } from '../common/helpers';
import id from '../common/id';
import { DATABASE_CONFIG } from '../config';
import { dbConnection } from '../db';

async function seedData() {
	const testDataPnL = new Array(220).fill(null).map((item) => ({
		userId: id.createId(),
		pnlValue: faker.datatype.number({ min: -100, max: 300, precision: 0.00001 }),
	}));
	
	const testDataUsernames: { [userId: string]: string} = {};
	testDataPnL.forEach(({ userId }) => {
		testDataUsernames[userId] = faker.internet.userName();
	});

	await forEachAsync(testDataPnL, async ({userId, pnlValue}) => {
		await dbConnection.redis.zadd(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, pnlValue, userId);
	});

	await dbConnection.redis.mset(testDataUsernames);

	dbConnection.close();
}

seedData();
