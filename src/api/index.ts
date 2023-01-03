import app from './server';
import { SERVER_CONFIG } from '../config';

app.listen(SERVER_CONFIG.PORT, () => console.log('app is running'));
