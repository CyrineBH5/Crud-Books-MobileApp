import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import { createBookJSON, deleteBookJSON, updateBookJSON } from './jsonServer';  


export async function initDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync('books.db');
    await db.execAsync(`

      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER,
        description TEXT,
        price REAL,  
        image TEXT   
      );
    `);
    console.log("La table 'books' est prête.");
    return db;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données :", error);
    throw new Error("Impossible d'initialiser la base de données");
  }
}
// export async function createBook(db, title, author, year, description, price, image) {
//   try {
//     const result = await db.runAsync(
//       'INSERT INTO books (title, author, year, description, price, image) VALUES (?, ?, ?, ?, ?, ?)',
//       title, author, year, description, price, image
//     );
//     const bookId = result.lastInsertRowId;
//     console.log(`Livre ajouté, id: ${bookId}`);
//     return bookId;
//   } catch (error) {
//     console.error("Erreur lors de l'ajout du livre :", error);
//     throw error;
//   }
// }

export async function createBook(db, title, author, year, description, price, image) {
  try {
    const result = await db.runAsync(
      'INSERT INTO books (title, author, year, description, price, image) VALUES (?, ?, ?, ?, ?, ?)',
      title, author, year, description, price, image
    );
    const bookId = result.lastInsertRowId; // Récupération de l'ID SQLite
    console.log(`Livre ajouté à SQLite, id: ${bookId}`);

    const bookData = { 
      id: parseInt(bookId, 10),  
      title, 
      author, 
      year, 
      description, 
      price, 
      image 
    };

    await createBookJSON(bookData)

    return bookId;  
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre :", error);
    throw error;
  }
}


// Lecture d'un livre via son id
export async function readBook(db, id) {
  const book = await db.getFirstAsync(
    'SELECT * FROM books WHERE id = ?',
    id
  );
  console.log("Livre récupéré:", book);
  return book;
}

// // Lecture de tous les livres
// export async function readAllBooks(db) {
//   const books = await db.getAllAsync('SELECT * FROM books');
//   console.log("Liste des livres:", books);
//   return books;
// }



export async function readAllBooks(db) {
  const books = await db.getAllAsync('SELECT * FROM books');
  return books.map((book) => ({
    ...book,
    id: parseInt(book.id, 10), // Convertir l'ID en nombre
  }));
}




// export async function updateBook(db, id, title, author, year, description, price, image) {
//   await db.runAsync(
//     `UPDATE books SET
//       title = ?,
//       author = ?,
//       year = ?,
//       description = ?,
//       price = ?,
//       image = ?
//     WHERE id = ?`,
//     title,
//     author,
//     year,
//     description,
//     price,
//     image,
//     id
//   );
// }

export async function updateBook(db, id, title, author, year, description, price, image) {
  try {
    console.log("start update database");

    const query = `
      UPDATE books SET
        title = ?, author = ?, year = ?, description = ?, price = ?, image = ?
      WHERE id = ?
    `;
    await db.runAsync(query, [title, author, year, description, price, image, parseInt(id, 10)]);
    console.log(`Livre mis à jour dans SQLite, id: ${id}`);

    const bookData = { title, author, year, description, price, image };
    await updateBookJSON(id, bookData);
    console.log("Livre mis à jour dans JSON Server");

  } catch (error) {
    console.error("Erreur lors de la mise à jour du livre :", error);
    throw error; 
  }
}


// Suppression d'un livre

export async function deleteBook(db, id) {
  try {
    const result = await db.runAsync(
      'DELETE FROM books WHERE id = ?',
      id
    );
    console.log(`Suppression effectuée dans SQLite, lignes supprimées: ${result.changes}`);

    try {
      await deleteBookJSON(id);
      console.log("Livre supprimé de JSON Server");
    } catch (jsonError) {
      if (jsonError.response && jsonError.response.status === 404) {
        console.log("Le livre n'existe pas dans JSON Server, suppression ignorée");
      } else {
        console.error("Erreur lors de la suppression du livre dans JSON Server :", jsonError);
        throw jsonError;  
      }
    }

    return result.changes;  
  } catch (error) {
    console.error("Erreur lors de la suppression du livre :", error);
    throw error;  
  }
}



