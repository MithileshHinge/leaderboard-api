import { faker } from '@faker-js/faker';
import request from 'supertest';
import app from '../../api/server';
import { dbConnection } from '../../db';
import { forEachAsync } from '../../common/helpers';
import id from '../../common/id';
import { DATABASE_CONFIG, RESULTS_PER_PAGE } from '../../config';

describe('GET /leaderboard e2e tests', () => {
	const testDataPnL = new Array(220).fill(null).map((item) => ({
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
		await dbConnection.redis.mset(testDataUsernames);
	});

	afterEach(async () => {
		await dbConnection.redis.del(DATABASE_CONFIG.REDIS_SORTED_SET_NAME);
	});

	afterAll(async () => {
		await dbConnection.close();
	});

	it('Respond with correct leaderboard page', async () => {
		const pageNo = faker.datatype.number({ min: 1, max: Math.ceil(testDataPnL.length / RESULTS_PER_PAGE), precision: 1 });
		const { body } = await request(app).get('/leaderboard').query({ pageNo }).expect(200);

		const leaderboardExpected = testDataPnL
			.sort((a, b) => b.pnlValue - a.pnlValue)
			.slice((pageNo - 1) * RESULTS_PER_PAGE, pageNo * RESULTS_PER_PAGE)
			.map(({ userId, pnlValue }) => ({
				userId,
				username: testDataUsernames[userId],
				pnlValue,
			}));

		expect(body).toStrictEqual(leaderboardExpected);
	});

	it('Respond with 400 (Bad Request) if pageNo <= 0', async () => {
		const pageNo = faker.datatype.number({ min: -1, max: 0, precision: 1 });
		await request(app).get('/leaderboard').query({ pageNo }).expect(400);
	});

	it('Respond with empty array if pageNo >= totalPages', async () => {
		const totalPages = Math.ceil(testDataPnL.length / RESULTS_PER_PAGE);
		const { body } = await request(app).get('/leaderboard').query({ pageNo: totalPages + 1 }).expect(200);
		expect(body).toStrictEqual([]);
	});
});
