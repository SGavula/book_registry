import { Book } from "../database";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { response } from "../helpers";
import { getRepository, Repository } from "typeorm";

export const getAllBooks = async (req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));

    let books: Array<Book> | undefined;
    const bookRepository = getRepository(Book);
	try {
        books = await bookRepository.find();
		if (!books)
			return res
				.status(400)
				.jsonp(response(400, 'No books found', {}));
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Books getted', books));
};

export const createBook = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));

    const bookRepository: Repository<Book> = getRepository(Book);
	let CreatedBook: Book | Object = {};
	try {
		CreatedBook = bookRepository.create({
			name: req.body.name,
			isbn: req.body.isbn,
			isAvailable: true,
			author: req.body.author
		});

		await bookRepository.save(CreatedBook);
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Books getted', CreatedBook));
};

export const editBook = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));

    const bookRepository: Repository<Book> = getRepository(Book);
	let BookToEdit: Book | undefined;
	try {
		
		BookToEdit = await bookRepository
			.createQueryBuilder('book')
			.where('book.id=:id', {id: req.params.book_id})
			.getOne();

		if (!BookToEdit)
			return res.status(404).jsonp(response(404, 'Book not found', req.body));

		BookToEdit.name = req.body.name || BookToEdit.name;
		BookToEdit.isbn = req.body.isbn || BookToEdit.isbn;
		BookToEdit.author = req.body.author || BookToEdit.author;

		await bookRepository.save(BookToEdit);

	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Book edited', BookToEdit));
};

export const deleteBook = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));

    const bookRepository: Repository<Book> = getRepository(Book);
	let BookToEdit: Book | undefined;
	try {
		
		BookToEdit = await bookRepository
			.createQueryBuilder('book')
			.where('book.id=:id', {id: req.params.book_id})
			.getOne();

		if (!BookToEdit)
			return res.status(404).jsonp(response(404, 'Book not found', req.body));

		await bookRepository.remove(BookToEdit);

	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Book deleted', BookToEdit));
};