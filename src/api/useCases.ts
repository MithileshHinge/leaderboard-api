import AddPnL from '../AddPnL';
import { RESULTS_PER_PAGE } from '../config';
import DataAccess from '../db/DataAccess';
import DbConnection from '../db/DbConnection';
import GetLeaderboard from '../GetLeaderboard';
import UpdatePnL from '../UpdatePnL';

export const dbConnection = new DbConnection();
const dataAccess = new DataAccess(dbConnection);

export const addPnL = new AddPnL(dataAccess);
export const updatePnL = new UpdatePnL(dataAccess);
export const getLeaderboard = new GetLeaderboard(dataAccess, RESULTS_PER_PAGE);
