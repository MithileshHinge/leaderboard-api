# leaderboard-api
REST API for paginated leaderboard service in a stock market app. Built with Clean Architecture and Test-driven development methodology.
Uses Redis Sorted Set to maintain the leaderboard rankings.

## Endpoints

#### POST /pnl
Submit PnL values. Body params:
##### pnl
Running Profit/Loss value

#### PATCH /pnl
Update PnL values. Body params:
##### pnl
Running Profit/Loss value

#### GET /rank
Get your rank

#### GET /leaderboard
Get leaderboard. Paginated to 50 results per page (configurable). Query params:
##### pageNo
The page number to fetch.

## Scripts

```npm run test```
Runs all the tests in \_\_test\_\_ directory

```npm run start:dev```
Start development server

```npm run start:prod```
Start production server

```npm run build```
Transpile TS to JS. Output directory: ./dist
