import request from 'supertest';
import jwt from 'jsonwebtoken';
import { DATABASE_CONFIG, JSON_SECRET } from '../../config';
import id from '../../common/id';
import app from '../../api/server';
import { faker } from '@faker-js/faker';
import { dbConnection } from '../../api/useCases';

describe('POST /pnl e2e tests', () => {

	afterEach(async () => {
		await dbConnection.redis.del(DATABASE_CONFIG.REDIS_SORTED_SET_NAME);
	});

	afterAll(async () => {
		await dbConnection.close();
	});

	it('Respond with 201 (Created) after successfully submitting PnL', async () => {
		const userId = id.createId();
		const pnl = faker.datatype.number({ min: -100, max: 300, precision: 0.1 });
		const token = jwt.sign({ userId }, JSON_SECRET);
		await request(app)
			.post('/pnl')
			.send({ pnl })
			.set('Authorization', `Bearer ${token}`)
			.expect(201);
		const addedPnL = await dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, userId);
		expect(parseFloat(addedPnL!)).toBeCloseTo(pnl);
	});

	it.todo('Respond with 401 (Unauthorized) if client is not authenticated');
	it.todo('Respond with 400 (Bad Request) if PnL value is < -100');
	it.todo('Respond with 400 (Bad Request) if PnL already submitted');
});
