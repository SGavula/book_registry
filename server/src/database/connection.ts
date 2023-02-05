import { ConnectionOptions, createConnection } from "typeorm";
import { Admin } from "./entities/Admin.entity";
import { Book } from "./entities/book.entity";
import { Borrowing } from "./entities/borrows.entity";
import path from 'path';
// dotenv
require('dotenv').config({
	path: path.resolve(__dirname, '../../.env')
});

let options: ConnectionOptions = {
    type: 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'book-registry',
    synchronize: true,
    logging: false,
    entities: [Book, Borrowing, Admin]
};

if (process.env.NODE_ENV == 'test') {
    options = {
        type: 'mariadb',
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: 'book-registry-test',
        synchronize: true,
        logging: false,
        entities: [Book, Borrowing, Admin]
    };}

export async function ConnectDB () {
    try {
        const connection = await createConnection(options);
        if (connection.isConnected == true) {
            console.log('Database connected');
        } else {
            throw new Error('Database connection failed');
        };
    } catch (error) {
        console.log("Vypisujem error", error);
    }
};