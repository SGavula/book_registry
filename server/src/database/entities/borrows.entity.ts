import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity()
export class Borrowing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column({
        type: 'date'
    })
    end: Date

    @ManyToOne(() => Book, book => book.borrowings, {
        onDelete: 'CASCADE'
    })
    book: Book;
}