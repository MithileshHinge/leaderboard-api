import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../api/server';
import { forEachAsync } from '../../common/helpers';
import id from '../../common/id';
import { DATABASE_CONFIG, RESULTS_PER_PAGE } from '../../config';
import { dbConnection } from '../../db';

describe('GET /leaderboard/numPages', () => {
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


	it('Can get correct total pages', async () => {
		const totalPages = Math.ceil(testDataPnL.length / RESULTS_PER_PAGE);
		const { body } = await request(app).get('/leaderboard/totalPages').expect(200);
		expect(body).toStrictEqual(totalPages);
	});
});
