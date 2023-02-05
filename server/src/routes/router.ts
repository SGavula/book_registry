import { app } from '../app';
import path from 'path';
import { BookRouter } from './Book.router';
import { BorrowRouter } from './Borrow.router';
import { UserRouter } from './User.router';
import { AuthRouter } from './Auth.router';

require('dotenv').config({
	path: path.resolve(__dirname, '../../.env')
});

const APP_ENVIRONMENT: string = process.env.APP_ENVIRONMENT!;
let prefix: string;
if (APP_ENVIRONMENT === 'development') prefix = '/api';
else if (APP_ENVIRONMENT === 'production') prefix = '';
else prefix = '/api';

app.use(`${prefix}`, BookRouter);
app.use(`${prefix}`, BorrowRouter);
app.use(`${prefix}`, UserRouter);
app.use(`${prefix}`, AuthRouter);

export default app;
