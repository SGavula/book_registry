import { ConnectDB } from "./connection";
import { CreateBooks } from "./seeders/book.seeder"


async function seedDb () {
    await ConnectDB();
    await CreateBooks();
};

seedDb()