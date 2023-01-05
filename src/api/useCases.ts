import AddPnL from '../AddPnL';
import { RESULTS_PER_PAGE } from '../config';
import { dataAccess } from '../db';
import GetLeaderboard from '../GetLeaderboard';
import GetRankSelf from '../GetRankSelf';
import UpdatePnL from '../UpdatePnL';

export const addPnL = new AddPnL(dataAccess);
export const updatePnL = new UpdatePnL(dataAccess);
export const getLeaderboard = new GetLeaderboard(dataAccess, RESULTS_PER_PAGE);
export const getRankSelf = new GetRankSelf(dataAccess);
