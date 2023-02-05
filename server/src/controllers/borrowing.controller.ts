import {Book, Borrowing} from '../database';
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { response } from "../helpers";
import { getRepository } from "typeorm";

export const getAllBorrowings = async (req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));

    let borrows: Array<Borrowing> | undefined;
    const BorrowRepository = getRepository(Borrowing);
	try {
        borrows = await BorrowRepository
            .createQueryBuilder('borrow')
            .leftJoinAndSelect('borrow.book', 'book')
            .getMany();

		if (!borrows)
			return res
				.status(400)
				.jsonp(response(400, 'No books found', {}));
                
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Books getted', borrows));
};

export const getSingleBorrowing = async (req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));

    let borrows: Borrowing | undefined;
    const BorrowRepository = getRepository(Borrowing);
	try {
        borrows = await BorrowRepository
            .createQueryBuilder('borrow')
            .leftJoinAndSelect('borrow.book', 'book')
			.where('borrow.id=:id', {id: req.params.id})
            .getOne();

		if (!borrows)
			return res
				.status(400)
				.jsonp(response(400, 'No books found', {}));
                
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Books getted', borrows));
};

export const createBorrowing = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));
	
	let Borrow: Borrowing;
    const BorrowRepository = getRepository(Borrowing);
    const BookRepository = getRepository(Book);
	try {
		const Book = await BookRepository.createQueryBuilder('book').select().where('book.id = :id', {id: req.body.book_id}).getOne();
		
		if (!Book)
			return res.status(400).jsonp(response(400, 'No Book  with that ID'));

		Book.isAvailable = false;

		Borrow = BorrowRepository.create({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			end: req.body.end,
			book: Book
		});

		await BookRepository.save(Book);
		await BorrowRepository.save(Borrow);
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Boorrow created', Borrow));
}

export const editBorrowing = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));
	
	let Borrow: Borrowing | undefined;
    const BorrowRepository = getRepository(Borrowing);
	try {		
		
		Borrow = await BorrowRepository.createQueryBuilder('borrow').where('borrow.id=:id', {id: req.params.id}).getOne();

		if (!Borrow)
			return res.status(400).jsonp(response(400, 'No borrow with that id'));

		Borrow.first_name = req.body.first_name || Borrow.first_name;
		Borrow.last_name = req.body.last_name || Borrow.last_name;
		Borrow.email = req.body.email || Borrow.email;
		Borrow.end = req.body.end || Borrow.end;


		await BorrowRepository.save(Borrow);
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Boorrow created', Borrow));
}

export const deleteBorrowing = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));
	
	let Borrow: Borrowing | undefined;
    const BorrowRepository = getRepository(Borrowing);
	const BookRepository = getRepository(Book);
	try {		
		
		Borrow = await BorrowRepository.createQueryBuilder('borrow').leftJoinAndSelect('borrow.book', 'book').where('borrow.id=:id', {id: req.params.id}).getOne();
		if (!Borrow)
			return res.status(400).jsonp(response(400, 'No borrow with that id'));


		let Book: Book | undefined = await BookRepository.createQueryBuilder('book').where('book.id=:id', {id: Borrow.book.id}).getOne();
		Book!.isAvailable = true;
		await BookRepository.save(Book!);
		await BorrowRepository.delete(Borrow);
		
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'Boorrow deleted'));
}