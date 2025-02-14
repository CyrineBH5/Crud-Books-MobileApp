import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useCart } from './cartprovider';
import { Ionicons } from '@expo/vector-icons';

export default function AjoutPanier({ route, navigation }: { route: any, navigation: any }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { book } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Ajouter le livre au panier dès l'entrée dans la page
  React.useEffect(() => {
    if (book) {
      addToCart(book);
    }
  }, [book]);

  // Fonction pour afficher la popup
  const handleValidation = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
      navigation.goBack();
    }, 2000); // Ferme la popup après 2 secondes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Panier</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Votre panier est vide.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.buttonQuantity}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.buttonQuantity}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleValidation}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      {/* Modal de validation */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={50} color="green" />
            <Text style={styles.modalText}>Panier validé avec succès !</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10 },
  image: { width: 80, height: 120, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  author: { fontSize: 14, color: '#777', marginBottom: 6 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  buttonQuantity: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: 'blue', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },

  // Styles pour la modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptyCart: { fontSize: 18, color: '#888', textAlign: 'center' },
});
