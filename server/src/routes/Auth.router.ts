import { login } from '../controllers';
import express from 'express';
const prefix: string = '/auth';

export const AuthRouter = express.Router();

AuthRouter.post(
    `${prefix}/login`,
    // AuthMiddleware
    login
);
