import { faker } from '@faker-js/faker';
import { forEachAsync } from '../../common/helpers';
import id from '../../common/id';
import { DATABASE_CONFIG } from '../../config';
import DataAccess from '../../db/DataAccess';
import DbConnection from '../../db/DbConnection';

describe('Data Access implementation tests', () => {
	const dbConnection = new DbConnection();
	const dataAccess = new DataAccess(dbConnection);
	const testUserId = id.createId();

	const testDataPnL = new Array(50).fill(null).map((item) => ({
		userId: id.createId(),
		pnlValue: faker.datatype.number({ min: -100, max: 300, precision: 0.00001 }),
	}));

	const testDataUsernames: { [userId: string]: string} = {};
	testDataPnL.forEach(({ userId }) => {
		testDataUsernames[userId] = faker.internet.userName();
	});

	beforeEach(async () => {
		await forEachAsync(testDataPnL, async ({userId, pnlValue}) => {
			await dbConnection.redis.zadd(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, pnlValue, userId);
		});
	});

	afterEach(async () => {
		await dbConnection.redis.del(DATABASE_CONFIG.REDIS_SORTED_SET_NAME);
	});

	afterAll(async () => {
		await dbConnection.close();
	});

	it('Can insert PnL value into db', async () => {
		await expect(dataAccess.insertPnLValue({ userId: testUserId, pnlValue: -20 })).resolves.not.toThrowError();
		await expect(dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, testUserId)).resolves.toBe('-20');
	});

	it('Can fetch PnL value from db', async () => {
		await expect(dataAccess.fetchPnLValue(testDataPnL[0].userId)).resolves.toBe(testDataPnL[0].pnlValue);
	});

	it('fetchPnLValue returns null if value not in db', async () => {
		await expect(dataAccess.fetchPnLValue(testUserId)).resolves.toBeNull();
	});

	it('Can update PnL value into db', async () => {
		await expect(dataAccess.updatePnLValue({ userId: testDataPnL[0].userId, pnlValue: 50.5 })).resolves.not.toThrowError();
		await expect(dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, testDataPnL[0].userId)).resolves.toBe('50.5');
	});

	it('Can fetch rank by userId', async () => {
		const rank = 20;
		const userId = testDataPnL.sort((a, b) => b.pnlValue - a.pnlValue)[rank - 1].userId;
		await expect(dataAccess.fetchRankByUserId(userId)).resolves.toBe(rank);
	});

	it('fetchRankByUserId returns null if userId is not in db', async () => {
		await expect(dataAccess.fetchRankByUserId(testUserId)).resolves.toBeNull();
	});

	it('Can fetch rankings by range', async () => {
		const from = 12;
		const to = 35;
		await expect(dataAccess.fetchRankingsByRange(from, to)).resolves.toEqual(testDataPnL.sort((a, b) => b.pnlValue - a.pnlValue).slice(from - 1, to));
	});

	it('Returns empty array if rankings not found in range', async () => {
		const from = 60;
		const to = 70;
		await expect(dataAccess.fetchRankingsByRange(from, to)).resolves.toStrictEqual([]);
	});

	it('Can fetch usernames by userIds', async () => {
		await expect(dbConnection.redis.mset(testDataUsernames)).resolves.not.toThrowError();
		await expect(dataAccess.fetchUsernamesByUserIds(Object.keys(testDataUsernames))).resolves.toEqual(testDataUsernames);
	});

	it('Can count total PnL entries', async () => {
		await expect(dataAccess.countTotalPnLEntries()).resolves.toStrictEqual(testDataPnL.length);
	});
});
