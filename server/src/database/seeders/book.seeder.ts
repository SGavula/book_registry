import { Book, Borrowing } from '../';
import {commerce,name,lorem, internet} from 'faker';
import { getRepository, Repository } from 'typeorm';

export async function CreateBooks () {
    console.log('Books seeding');
    for (let i = 0; i < 250;  i++) {
        const BookRepository: Repository<Book> = getRepository(Book);
        const BorrowRepository: Repository<Borrowing> = getRepository(Borrowing);

        // Clear previous entries
        // await BorrowRepository.clear();
        // await BookRepository.clear();

        const bookName: string = commerce.productName();
        const isbn: string = lorem.word();
        const type: boolean = i % 2 == 0 ? false : true;
        const author: string = name.findName();
    
        const NewBook = BookRepository.create({
            name: bookName,
            isbn: isbn,
            isAvailable: type,
            author: author
        })

        await BookRepository.save(NewBook);        

        if (i % 2 == 0) {
            const fname = name.firstName();
            const lname = name.lastName();
            const email = internet.email();
            const end = '2022-07-15'

            const NewBorrowing = BorrowRepository.create({
                first_name: fname,
                last_name: lname,
                email: email,
                end: end,
                book: NewBook
            })

            await BorrowRepository.save(NewBorrowing);
        }
    }
    console.log('Books and borrows seeded');
}