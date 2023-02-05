import {body, param} from 'express-validator';

export const createBorrowValidator = [
    body('book_id')
        .exists()
        .withMessage('book_id must exist')
        .isInt()
        .withMessage('book_id must be Integer')
        .toInt(),
    
    body('first_name')
        .exists()
        .withMessage('first_name must exist')
        .isString()
        .withMessage('first_name must be string')
        .trim(),
    
    body('last_name')
        .exists()
        .withMessage('last_name must exist')
        .isString()
        .withMessage('last_name must be string')
        .trim(),
    
    body('email')
        .exists()
        .withMessage('email must exist')
        .isEmail()
        .withMessage('email must be string and email')
        .trim(),
    
    body('end')
        .exists()
        .withMessage('end must exist')
        .isDate()
        .withMessage('end must be a date')
]

export const editBorrowValidator = [
    param('id')
        .exists()
        .withMessage('id must be exist')
]