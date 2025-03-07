import { readAllBooksJSON } from './jsonServer';
import { createBook } from './database';

export const syncJSONServer = async (db) => {
  try {
    const booksFromJSON = await readAllBooksJSON();

    for (let book of booksFromJSON) {
      await createBook(db, book.title, book.author, book.year, book.description, book.price, book.image);
    }

    console.log("Synchronisation avec JSON Server terminée.");
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec JSON Server :", error);
    throw error;
  }
};
