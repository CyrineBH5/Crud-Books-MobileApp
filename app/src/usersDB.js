import * as SQLite from 'expo-sqlite';

export async function initUserDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync('users.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone_number TEXT
      );
    `);
    console.log("La table 'users' est prête.");
    return db;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
    throw error;
  }
}

export async function createUser(db, username, password, firstName, lastName, phoneNumber) {
  try {
    const result = await db.runAsync(
      'INSERT INTO users (username, password, role, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      username,
      password,
      'admin',
      firstName,
      lastName,
      phoneNumber
    );
    const userId = result.lastInsertRowId;
    console.log(`Utilisateur créé avec l'ID: ${userId}`);
    return userId;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
}

export async function loginUser(db, username, password) {
  try {
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      username, password
    );
    
    if (user) {
      console.log("Connexion réussie :", user);
      return user;
    } else {
      console.log("Nom d'utilisateur ou mot de passe incorrect");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la tentative de connexion :", error);
    throw error;
  }
}