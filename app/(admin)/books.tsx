import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { initDatabase, readAllBooks, deleteBook } from '../src/database';

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
        const books = await readAllBooks(db);
        setBooks(books);
      } catch (error) {
        console.error("Erreur lors du chargement des livres :", error);
      }
    };

    loadBooks();
  }, []);

  const handleDeleteBook = async (id: number) => {
    try {
      const db = await initDatabase();
      await deleteBook(db, id);
      setBooks(books.filter(book => book.id !== id));
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
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => handleDeleteBook(id), style: 'destructive' },
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
      {/* Barre de recherche et bouton Ajouter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un livre..."
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
          <Text style={styles.emptyText}>Livre introuvable</Text>
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
