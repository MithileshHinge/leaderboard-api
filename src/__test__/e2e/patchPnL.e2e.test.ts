import request from 'supertest';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { dbConnection } from '../../db';
import id from '../../common/id';
import { DATABASE_CONFIG, JSON_SECRET } from '../../config';
import app from '../../api/server';

describe('PATCH /pnl e2e tests', () => {

	const userId = id.createId();
	const token = jwt.sign({ userId }, JSON_SECRET);
	const pnlInitial = faker.datatype.number({ min: -100, max: 300, precision: 0.1 });
	beforeEach(async () => {
		await dbConnection.redis.zadd(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, pnlInitial, userId);
	});

	afterEach(async () => {
		await dbConnection.redis.del(DATABASE_CONFIG.REDIS_SORTED_SET_NAME);
	});

	afterAll(async () => {
		await dbConnection.close();
	});

	it('Respond with 200 after successfully updating PnL', async () => {
		const pnl = faker.datatype.number({ min: -100, max: 300, precision: 0.1 });
		await request(app)
			.patch('/pnl')
			.send({ pnl })
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
		const updatedPnL = await dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, userId);
		expect(parseFloat(updatedPnL!)).toBeCloseTo(pnl);
	});

	it('Respond with 401 (Unauthorized) if client is not authenticated', async () => {
		const pnl = faker.datatype.number({ min: -100, max: 300, precision: 0.1 });
		await request(app).patch('/pnl').send({ pnl }).expect(401);
		const updatedPnL = await dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, userId);
		expect(parseFloat(updatedPnL!)).toBeCloseTo(pnlInitial);
	});

	it('Respond with 400 (Bad Request) if PnL value is < -100', async () => {
		const pnl = -100.5;
		await request(app)
			.patch('/pnl')
			.send({ pnl })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
		const updatedPnL = await dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, userId);
		expect(parseFloat(updatedPnL!)).toBeCloseTo(pnlInitial);
	});

	it('Respond with 400 (Bad Request) if PnL does not exist already', async () => {
		const newUserId = id.createId();
		const token = jwt.sign({ userId: newUserId }, JSON_SECRET);
		const pnl = faker.datatype.number({ min: -100, max: 300, precision: 0.1 });
		await request(app)
			.patch('/pnl')
			.send({ pnl })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
		await expect(dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, newUserId)).resolves.toBeNull();
	});
});
