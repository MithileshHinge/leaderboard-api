import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import DataAccess from '../db/DataAccess';
import UpdatePnL from '../UpdatePnL';
jest.mock('../db/DataAccess');

describe('Update PnL use case tests', () => {
	const mockDataAccess = new DataAccess() as jest.Mocked<DataAccess>;
	mockDataAccess.fetchPnLValue.mockImplementation(async () => 23);
	const updatePnL = new UpdatePnL(mockDataAccess);
	
	const testUserId = id.createId();

	afterEach(() => {
		Object.values(mockDataAccess).forEach((mockMethod) => {
			if (typeof mockMethod === 'function') {
				mockMethod.mockClear();
			}
		});
	});

	it('User can successfully update PnL', async () => {
		await expect(updatePnL.update(testUserId, -20)).resolves.not.toThrowError();
		expect(mockDataAccess.updatePnLValue).toHaveBeenCalledWith({ userId: testUserId, pnlValue: -20 });
	});

	describe('Throw error if userId is invalid', () => {
		['abc', 123, undefined, null].forEach((userId: any) => {
			it(`Should throw error for userId: ${userId}`, async () => {
				await expect(updatePnL.update(userId, -20)).rejects.toThrow(ValidationError);
				expect(mockDataAccess.updatePnLValue).not.toHaveBeenCalled();
			})
		});
	});

	it('Throw error if PnL is less than -100', async () => {
		await expect(updatePnL.update(testUserId, -101)).rejects.toThrow(ValidationError);
		expect(mockDataAccess.updatePnLValue).not.toHaveBeenCalled();
	});
	
	it('Throw error if PnL does not exist already', async () => {
		mockDataAccess.fetchPnLValue.mockImplementationOnce(async () => null);
		await expect(updatePnL.update(testUserId, -20)).rejects.toThrow(ValidationError);
		expect(mockDataAccess.updatePnLValue).not.toHaveBeenCalled();
	});
});
