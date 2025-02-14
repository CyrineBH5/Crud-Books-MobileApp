import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DetailsBook({ route, navigation }: { route: any, navigation: any }) {
  const { book } = route.params;

  const handleAddToCart = () => {
    console.log(`${book.title} ajouté au panier`);
    navigation.navigate('AjoutPanier', { book:book, quantity:1 });
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={book.image} 
        style={styles.image} 
        resizeMode="contain" 
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.date}>{book.date}</Text>
        <Text style={styles.description}>{book.description}</Text>
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  author: {
    fontSize: 20,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
