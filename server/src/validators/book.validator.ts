import { body, param } from "express-validator";

export const createBookValidator = [
    body('name')
        .exists()
        .withMessage('Name must exist')
        .isString()
        .withMessage('Body must be string')
        .trim(),
    
    body('author')
        .exists()
        .withMessage('Author must exist')
        .isString()
        .withMessage('Author must be string')
        .trim(),
    
    body('isbn')
        .exists()
        .withMessage('ISBN must exist')
        .isString()
        .withMessage('ISBN must be string')
        .trim()
]

export const editBookValidator = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be string')
        .trim(),
    
    body('author')
        .optional()
        .isString()
        .withMessage('Author must be string')
        .trim(),

    body('isbn')
        .optional()
        .isString()
        .withMessage('isbn must be string')
        .trim(),

    param('book_id')
        .exists()
        .withMessage('book_id must exist')
        .isInt()
        .withMessage('book_id must be int')
        .toInt()
];

export const deleteBookValidator = [
    param('book_id')
        .exists()
        .withMessage('book_id must exist')
        .isInt()
        .withMessage('book_id must be int')
        .toInt()
]