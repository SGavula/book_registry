// Imports
import express, {Request, Response} from 'express';
import cors from 'cors';
import 'dotenv';
import { ConnectDB } from './database';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import bodyParser from 'body-parser';
import path from 'path';
// dotenv
require('dotenv').config({
	path: path.resolve(__dirname, '../.env')
});

// Initialize express
export const app: express.Application = express();
// PORT TO LISTEN ON
const port = parseInt(process.env.PORT as string) || 8000;

// Use cors
app.use(cors());
app.use(bodyParser());

// Documentation setup
const swaggerOptions: SwaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'Book Registry REST API',
			description: 'All API endpoints for Book Registry Application',
			contact: {
				name: 'G&G Studio'
			},
			servers:['http://localhost:8000/api']
		}
	},
	apis: ["**/*.ts"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Add routes
require('./routes/router');

// Connect to Database
ConnectDB();

// Test route

app.get('/', (_req: Request, res: Response) => {
	res
		.status(200)
		.send(
			`<h1 style="text-align:center">Express server listening on port ${port}!</h1>`
		);
});

// Listen on PORT
if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`Express server listening on port ${port}!`);
	});
}