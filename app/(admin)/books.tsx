import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { initDatabase, readAllBooks, deleteBook } from '../src/database';
import axios from 'axios';
import { deleteBookJSON, readAllBooksJSON } from '../src/jsonServer';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  price: number;
  image: string;
}

const Books = ({ navigation }: { navigation: any }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const db = await initDatabase();
        const booksFromSQLite: Book[] = await readAllBooks(db);
  
        // Utiliser la méthode de jsonServer.js pour récupérer les livres
        const booksFromJSON: Book[] = await readAllBooksJSON();
  
        console.log("Livres SQLite :", booksFromSQLite);
        console.log("Livres JSON Server :", booksFromJSON);
  
        // Fusionner les listes sans doublons
        const uniqueBooks = [...booksFromSQLite];
        booksFromJSON.forEach((book: Book) => {
          if (!uniqueBooks.some((b) => b.id === book.id)) {
            uniqueBooks.push(book);
          }
        });
  
        setBooks(uniqueBooks);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
      }
    };
  
    loadBooks();
  }, []);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('admin');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };


  const handleDeleteBook = async (id: number) => {
    try {
      const db = await initDatabase();
  
      // Supprimer le livre de SQLite
      await deleteBook(db, id);
      // Mettre à jour l'état local
      setBooks(books.filter(book => book.id !== id));
  
      console.log("Livre supprimé avec succès de SQLite");
    } catch (error) {
      console.error("Erreur lors de la suppression du livre :", error);
      Alert.alert('Erreur', "Une erreur s'est produite lors de la suppression du livre");
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce livre ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: () => handleDeleteBook(id), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      {item.image && <Image source={{ uri: item.image }} style={styles.bookImage} />}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.bookPrice}>{item.price} TND</Text>
      </View>
      <View style={styles.bookActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('UpdateBook', { bookId: item.id })}
        >
          <MaterialIcons name="edit" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmDelete(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Logout button at the top */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Manage Books</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche et bouton Ajouter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a book..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBook')}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error-outline" size={50} color="#aaa" />
          <Text style={styles.emptyText}>Book Not Found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bookDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  bookPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  bookActions: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
});

export default Books;