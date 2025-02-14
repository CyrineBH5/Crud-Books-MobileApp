import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { initDatabase, createBook, readAllBooks, updateBook, deleteBook } from '../src/database'; // Vérifiez le chemin d'importation
import * as SQLite from 'expo-sqlite';

export default function BooksManager() {

    interface Book {
        id: number;
        title: string;
        author: string;
        year: number;
      }
      const [db, setDb] = useState<SQLite.SQLiteDatabase | null | undefined>(undefined);
      const [books, setBooks] = useState<Book[]>([]);
      const [title, setTitle] = useState<string>('');
      const [author, setAuthor] = useState<string>('');
      const [year, setYear] = useState<string>('');
      const [editingId, setEditingId] = useState<number | null>(null);
      
  // Initialisation de la base au montage du composant
  useEffect(() => {
    async function initDb() {
      const database = await initDatabase();
      setDb(database);
      await refreshBooks(database);
    }
    initDb();
  }, []);

  // Fonction de rafraîchissement de la liste des livres
  async function refreshBooks(database = db) {
    if (!database) return;
    const list = await readAllBooks(database);
    setBooks(list);
  }

  // Gérer l'ajout ou la modification selon l'état (editingId)
  async function handleAddOrUpdate() {
    if (!title || !author || !year) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis");
      return;
    }
    try {
      if (editingId === null) {
        // Ajout d'un nouveau livre
        await createBook(db, title, author, parseInt(year));
      } else {
        // Mise à jour d'un livre existant
        await updateBook(db, editingId, title, author, parseInt(year));
        setEditingId(null);
      }
      // Réinitialiser le formulaire
      setTitle('');
      setAuthor('');
      setYear('');
      refreshBooks();
    } catch (error) {
      console.error("Erreur lors de l'ajout/mise à jour :", error);
    }
  }

  // Préparer la modification d'un livre en remplissant le formulaire
  function handleEdit(book : Book) {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year.toString());
  }

  // Supprimer un livre avec confirmation
  async function handleDelete(id : number) {
    Alert.alert(
      "Supprimer le livre",
      "Êtes-vous sûr de vouloir supprimer ce livre ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: async () => {
            await deleteBook(db, id);
            refreshBooks();
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des livres</Text>
      {/* Formulaire d'ajout/modification */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Titre"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Auteur"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          placeholder="Année"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
        <Button
          title={editingId === null ? "Ajouter" : "Modifier"}
          onPress={handleAddOrUpdate}
        />
      </View>

      {/* Liste des livres */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookText}>
              {item.title} - {item.author} ({item.year})
            </Text>
            <View style={styles.actions}>
              <Button title="Modifier" onPress={() => handleEdit(item)} />
              <Button title="Supprimer" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  form: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  bookItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  bookText: { fontSize: 18 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }
});
