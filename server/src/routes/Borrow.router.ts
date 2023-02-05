import { createBorrowing, deleteBorrowing, editBorrowing, getAllBorrowings, getSingleBorrowing } from '../controllers';
import express from 'express';
import { createBorrowValidator, editBorrowValidator } from '../validators';
import { AuthMiddleware } from '../middlewares';

export const BorrowRouter = express.Router();
const prefix = '/borrow';

/**
 * @swagger
 * /api/borrow:
 *  get:
 *   summary: Gets all borrows
 *   tags:
 *    - BORROW
 *   responses:
 *    '200':
 *      description: Successful response - all borrows getted
 *      schema:
 *       type: array
 *       items:
 *          type: object
 *          properties:
 *              id:
 *                  type: int
 *                  description: ID of the borrow
 *                  example: 1
 *              first_name:
 *                  type: string
 *                  description: First Name of the borrower
 *                  example: 'Adam'
 *              last_name:
 *                  type: string
 *                  description: Last Name of the borrower
 *                  example: 'Franko'
 *              email:
 *                  type: string
 *                  description: Email of the borrower
 *                  example: "adam@franko.sk"
 *              end:
 *                  type: Date
 *                  description: Datetime of the end of the borrowing period in format YYYY-MM-DD
 *                  example: '2022-06-19'
 *    '404':
 *      description: No borrowings found
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 */
BorrowRouter.get(
    `${prefix}`, 
    AuthMiddleware(),
    getAllBorrowings
);

/**
 * @swagger
 * /api/borrow/{id}:
 *  get:
 *   summary: Gets single borrow
 *   tags:
 *    - BORROW
 *   parameters:
 *    - in: path
 *      name: id
 *      description: ID of the borrow to get
 *      schema:
 *          type: integer
 *      required: true
 *      example: 31
 *   responses:
 *    '200':
 *      description: Borrow getted
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Id of the borrow
 *                  example: 1
 *              first_name:
 *                  type: string
 *                  description: First name of the borrower
 *                  example: "Adam Franko"
 *              last_name:
 *                  type: string
 *                  description: Last name of the borrower
 *                  example: "Franko"
 *              email:
 *                  type: string
 *                  description: Email of the borrower
 *                  example: 'adam@franko.sk'
 *              end:
 *                  type: string
 *                  description: Return deadline in format YYYY-MM-DD
 *                  example: '2022-06-25'
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 *    '404':
 *      description: Borrow with that ID was not found
 */
BorrowRouter.get(
    `${prefix}/:id`, 
    AuthMiddleware(),
    getSingleBorrowing
);

/**
 * @swagger
 * /api/borrow/:
 *  post:
 *   summary: Creates borrow
 *   tags:
 *    - BORROW
 *   parameters:
 *    - in: body
 *      name: book_id
 *      description: ID of the book that is being borrowed
 *      schema:
 *          type: integer
 *      required: true
 *      example: 10
 *    - in: body
 *      name: first_name
 *      description: First Name of the borrower
 *      schema:
 *          type: string
 *      required: true
 *      example: 'Adam'
 *    - in: body
 *      name: last_name
 *      description: Last Name of the borrower
 *      schema:
 *          type: string
 *      required: true
 *      example: 'Franko'
 *    - in: body
 *      name: email
 *      description: Email of the borrower
 *      schema:
 *          type: string
 *      required: true
 *      example: 'adam@franko.sk'
*    - in: body
 *      name: end
 *      description: End date of the borrow in format YYYY-MM-DD
 *      schema:
 *          type: string
 *      required: true
 *      example: '2022-07-15'
 *   responses:
 *    '200':
 *      description: Borrow created
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Id of the borrow
 *                  example: 1
 *              first_name:
 *                  type: string
 *                  description: First name of the borrower
 *                  example: "Adam Franko"
 *              last_name:
 *                  type: string
 *                  description: Last name of the borrower
 *                  example: "Franko"
 *              email:
 *                  type: string
 *                  description: Email of the borrower
 *                  example: 'adam@franko.sk'
 *              end:
 *                  type: string
 *                  description: Return deadline in format YYYY-MM-DD
 *                  example: '2022-07-15'
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 *    '404':
 *      description: Borrow with that ID was not found
 */
BorrowRouter.post(
    `${prefix}`, 
    AuthMiddleware(),
    createBorrowValidator,
    createBorrowing
);

/**
 * @swagger
 * /api/borrow/{id}:
 *  put:
 *   summary: Edits borrow
 *   tags:
 *    - BORROW
 *   parameters:
 *    - in: param
 *      name: id
 *      description: ID of the borrow to edit
 *      schema:
 *          type: integer
 *      required: true
 *      example: 10
 *    - in: body
 *      name: first_name
 *      description: First Name of the borrower
 *      schema:
 *          type: string
 *      required: true
 *      example: 'Adam'
 *    - in: body
 *      name: last_name
 *      description: Last Name of the borrower
 *      schema:
 *          type: string
 *      required: true
 *      example: 'Franko'
 *    - in: body
 *      name: email
 *      description: Email of the borrower
 *      schema:
 *          type: string
 *      required: true
 *      example: 'adam@franko.sk'
*    - in: body
 *      name: end
 *      description: End date of the borrow in format YYYY-MM-DD
 *      schema:
 *          type: string
 *      required: true
 *      example: '2022-07-15'
 *   responses:
 *    '200':
 *      description: Borrow created
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Id of the borrow
 *                  example: 1
 *              first_name:
 *                  type: string
 *                  description: First name of the borrower
 *                  example: "Adam Franko"
 *              last_name:
 *                  type: string
 *                  description: Last name of the borrower
 *                  example: "Franko"
 *              email:
 *                  type: string
 *                  description: Email of the borrower
 *                  example: 'adam@franko.sk'
 *              end:
 *                  type: string
 *                  description: Return deadline in format YYYY-MM-DD
 *                  example: '2022-07-15'
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 *    '404':
 *      description: Borrow with that ID was not found
 */
BorrowRouter.put(
    `${prefix}/:id`, 
    AuthMiddleware(),
    editBorrowValidator,
    editBorrowing
);

BorrowRouter.delete(
    `${prefix}/:id`,
    AuthMiddleware(),
    editBorrowValidator,
    deleteBorrowing
)