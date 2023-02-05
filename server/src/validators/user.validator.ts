import { body } from "express-validator";


export const createUserValidator = [
    body('name')
        .exists()
        .withMessage('name must be defined')
        .isString()
        .withMessage('name must be string')
        .trim(),
    
    body('email')
        .exists()
        .withMessage('email must exist')
        .isEmail()
        .withMessage('email must be in email format')
        .trim(),
    
    body('password')
        .exists()
        .withMessage('password must be defined')
        .isString()
        .withMessage('password must be string')
        .trim(),
    
    body('sub_password')
        .exists()
        .withMessage('sub_password must exist')
        .isString()
        .withMessage('sub_password must be string')
        .trim()
];