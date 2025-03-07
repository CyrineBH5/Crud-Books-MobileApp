import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'installer cette dépendance si nécessaire

const { width } = Dimensions.get('window');

export default function DetailsBook({ route, navigation }: { route: any, navigation: any }) {
  const { book } = route.params;
  
  const handleAddToCart = () => {
    console.log(`${book.title} ajouté au panier`);
    navigation.navigate('AjoutPanier', { book: book, quantity: 1 });
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
  
        
        <View style={styles.imageWrapper}>
          <Image
            source={typeof book.image === 'string' ? { uri: book.image } : book.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <View style={styles.authorRow}>
            <Text style={styles.authorLabel}>Author:</Text>
            <Text style={styles.author}>{book.author}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of publication</Text>
              <Text style={styles.infoValue}>{book.year}</Text>
            </View>
            {/* Vous pouvez ajouter d'autres infos ici comme le prix, la catégorie, etc. */}
          </View>
          
          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>About the book :</Text>
          <Text style={styles.description}>{book.description}</Text>
          
          <View style={styles.actionContainer}>
           
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
              <Ionicons name="cart-outline" size={22} color="#fff" style={styles.cartIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    lineHeight: 30,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
  },
  author: {
    fontSize: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoItem: {
    marginRight: 24,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eaeaea',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 30,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  cartIcon: {
    marginLeft: 4,
  }
});