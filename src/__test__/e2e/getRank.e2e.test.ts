import { faker } from '@faker-js/faker';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../api/server';
import { dbConnection } from '../../api/useCases';
import { forEachAsync } from '../../common/helpers';
import id from '../../common/id';
import { DATABASE_CONFIG, JSON_SECRET } from '../../config';

describe('GET /rank e2e tests', () => {
	const testDataPnL = new Array(220).fill(null).map((item) => ({
		userId: id.createId(),
		pnlValue: faker.datatype.number({ min: -100, max: 300, precision: 0.00001 }),
	}));

	const testDataPnLFirst = testDataPnL[0];
	const userId = testDataPnL[0].userId;
	const pnlValue = testDataPnL[0].pnlValue;
	const rank = testDataPnL.sort((a, b) => b.pnlValue - a.pnlValue).indexOf(testDataPnLFirst) + 1;

	const testDataUsernames: { [userId: string]: string} = {}
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

	it('Respond with rank successfully', async () => {
		const token = jwt.sign({ userId }, JSON_SECRET);
		const { body } = await request(app).get('/rank').set('Authorization', `Bearer ${token}`).expect(200);

		expect(body).toBe(rank);
	});

	it('Respond with 401 (Unauthorized) if client is not authenticated', async () => {
		await request(app).get('/rank').expect(401);
	});

	it('Respond with 400 (Bad Request) if user has not added PnL', async () => {
		const newUserId = id.createId();
		const token = jwt.sign({ userId: newUserId }, JSON_SECRET);

		await request(app).get('/rank').set('Authorization', `Bearer ${token}`).expect(400);
	});
});
