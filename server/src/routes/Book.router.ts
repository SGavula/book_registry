import { createBook, deleteBook, editBook, getAllBooks } from '../controllers';
import express from 'express';
import { createBookValidator, deleteBookValidator, editBookValidator } from '../validators';
import { AuthMiddleware } from '../middlewares';
const prefix: string = '/book';

export const BookRouter = express.Router();


/**
 * @swagger
 * /api/book:
 *  get:
 *   summary: Gets all the books
 *   tags:
 *    - BOOK
 *   responses:
 *    '200':
 *      description: Successful response - all books getted
 *      schema:
 *       type: array
 *       items:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the book
 *                  example: "Harry Potter and the Philosopher's Stone"
 *              author:
 *                  type: string
 *                  description: Name of the author of the book
 *                  example: 'J.K. Rowling'
 *              isbn:
 *                  type: string
 *                  description: ISBN of the book
 *                  example: '9781408865262'
 *              isAvailable:
 *                  type: boolean
 *                  description: True/False indicator if the book is available for rent
 *                  example: false
 *    '404':
 *      description: No books found
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 */
BookRouter.get(
    `${prefix}`, 
    AuthMiddleware(),
    getAllBooks
);


/**
 * @swagger
 * /api/book:
 *  post:
 *   summary: Creates a new book instance in the database
 *   tags:
 *    - BOOK
 *   parameters:
 *    - in: body
 *      name: Book
 *      description: The book to create
 *      schema:
 *          type: object
 *          required:
 *              - name
 *              - author
 *              - isbn
 *          properties:
 *              name:
 *                  type: string
 *                  example: "Harry Potter and the Philosopher's Stone"
 *              author:
 *                  type: string
 *                  example: 'J.K. Rownling'
 *              isbn:
 *                  type: string
 *                  example: '9781408865262'
 *   responses:
 *    '200':
 *      description: Successful response - created a book instance in the database
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Id of the book
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: Name of the book
 *                  example: "Harry Potter and the Philosopher's Stone"
 *              author:
 *                  type: string
 *                  description: Author of the book
 *                  example: "J.K. Rownling"
 *              isbn:
 *                  type: string
 *                  description: ISBN of the book
 *                  example: '9781408865262'
 *              isAvailable:
 *                  type: boolean
 *                  description: Indicator if the book is available
 *                  example: true
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 */
BookRouter.post(
    `${prefix}`,
    AuthMiddleware(),
    createBookValidator,
    createBook
);


/**
 * @swagger
 * /api/book/{book_id}:
 *  put:
 *   summary: Edits book
 *   tags:
 *    - BOOK
 *   parameters:
 *    - in: body
 *      name: Book
 *      description: The parameters to edit
 *      schema:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example: "Harry Potter and the Philosopher's Stone"
 *              author:
 *                  type: string
 *                  example: 'J.K. Rownling'
 *              isbn:
 *                  type: string
 *                  example: '9781408865262'
 *    - in: path
 *      name: book_id
 *      description: ID of the book to edit
 *      schema:
 *          type: integer
 *      required: true
 *      example: 31
 *   responses:
 *    '200':
 *      description: Successful response - edited a book instance in the database
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Id of the book
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: Name of the book
 *                  example: "Harry Potter and the Philosopher's Stone"
 *              author:
 *                  type: string
 *                  description: Author of the book
 *                  example: "J.K. Rownling"
 *              isbn:
 *                  type: string
 *                  description: ISBN of the book
 *                  example: '9781408865262'
 *              isAvailable:
 *                  type: boolean
 *                  description: Indicator if the book is available
 *                  example: true
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 *    '404':
 *      description: Book with that ID was not found
 */
BookRouter.put(
    `${prefix}/:book_id`,
    AuthMiddleware(),
    editBookValidator,
    editBook
);


/**
 * @swagger
 * /api/book/{book_id}:
 *  delete:
 *   summary: Deletes book
 *   tags:
 *    - BOOK
 *   parameters:
 *    - in: path
 *      name: book_id
 *      description: ID of the book to delete
 *      schema:
 *          type: integer
 *      required: true
 *      example: 31
 *   responses:
 *    '200':
 *      description: Successful response - deleted a book instance in the database
 *      schema:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the book
 *                  example: "Harry Potter and the Philosopher's Stone"
 *              author:
 *                  type: string
 *                  description: Author of the book
 *                  example: "J.K. Rownling"
 *              isbn:
 *                  type: string
 *                  description: ISBN of the book
 *                  example: '9781408865262'
 *              isAvailable:
 *                  type: boolean
 *                  description: Indicator if the book is available
 *                  example: true
 *    '400':
 *      description: BAD REQUEST - details are in response from express-validator
 *    '404':
 *      description: Book with that ID was not found
 */
BookRouter.delete(
    `${prefix}/:book_id`,
    AuthMiddleware(),
    deleteBookValidator,
    deleteBook
);