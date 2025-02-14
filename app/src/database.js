import * as SQLite from 'expo-sqlite';


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
        price REAL,  -- Colonne pour le prix
        image TEXT   -- Colonne pour l'URI de l'image
      );
    `);
    console.log("La table 'books' est prête.");
    return db;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données :", error);
    throw new Error("Impossible d'initialiser la base de données");
  }
}
export async function createBook(db, title, author, year, description, price, image) {
  try {
    const result = await db.runAsync(
      'INSERT INTO books (title, author, year, description, price, image) VALUES (?, ?, ?, ?, ?, ?)',
      title, author, year, description, price, image
    );
    const bookId = result.lastInsertRowId;
    console.log(`Livre ajouté, id: ${bookId}`);
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

// Lecture de tous les livres
export async function readAllBooks(db) {
  const books = await db.getAllAsync('SELECT * FROM books');
  console.log("Liste des livres:", books);
  return books;
}

export async function updateBook(db, id, title, author, year, description, price, image) {
  await db.runAsync(
    `UPDATE books SET
      title = ?,
      author = ?,
      year = ?,
      description = ?,
      price = ?,
      image = ?
    WHERE id = ?`,
    title,
    author,
    year,
    description,
    price,
    image,
    id
  );
}
// Suppression d'un livre
export async function deleteBook(db, id) {
  const result = await db.runAsync(
    'DELETE FROM books WHERE id = ?',
    id
  );
  console.log(`Suppression effectuée, lignes supprimées: ${result.changes}`);
  return result.changes;
}
