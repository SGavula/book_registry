import express from 'express';
import { createUserValidator } from '../validators';
import { createUser } from '../controllers';
//import { AuthMiddleware } from '../middlewares';
const prefix: string = '/user';

export const UserRouter = express.Router();

UserRouter.post(
    `${prefix}`,
    //AuthMiddleware(),
    createUserValidator,
    createUser
);
