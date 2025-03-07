import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { readAllBooks } from '../src/database'; 
import { initDatabase } from '../src/database'; 
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

export default function BookList({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [username, setUsername] = useState<string>('Client');

  useEffect(() => {
    async function fetchBooks() {
      try {
        const db = await initDatabase(); 
        const booksList = await readAllBooks(db); 
        setBooks(booksList);  
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username || 'Client');
        }
      } catch (error) {
        console.error("Erreur de chargement des livres :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Deconnexion',
      'Are you sure you want to logout?',
      [
        { text: 'cancel', style: 'cancel' },
        { text: 'Deconnexion', onPress: handleLogout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton de déconnexion */}
      <View style={styles.headerContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <Text style={styles.usernameText}>Hey, {username}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Titre de la page */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Book Catalog</Text>
      </View>

      {books.length > 0 ? (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => ( 
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('DetailsBook', { book: item })} 
              android_ripple={{ color: '#ddd' }}  
            >
              <Image 
                source={{ uri: item.image }}  
                style={styles.image} 
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
                <View style={styles.infoRow}>
                  <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color="#888" />
                    <Text style={styles.date}>{item.year}</Text>
                  </View>
                  <Text style={styles.price}>{item.price} TND</Text>
                </View>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="library-books" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No books available</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    marginTop:'-5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  usernameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
    fontSize: 14,
  },
  titleContainer: {
    padding: 15,
    paddingBottom: 5,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  list: {
    padding: 15,
    paddingTop: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  }
});