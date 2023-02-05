import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Borrowing } from "./borrows.entity";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    author: string;

    @Column()
    isbn: string;

    @Column()
    isAvailable: boolean;

    @OneToMany(() => Borrowing, borrowing => borrowing.book, {
        cascade: true
    })
    borrowings: Borrowing[]
}