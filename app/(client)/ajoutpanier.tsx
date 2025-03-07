import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView, StatusBar } from 'react-native';
import { useCart } from '../cartprovider';

export default function AjoutPanier({ route, navigation }: { route: any, navigation: any }) {
  const { cart, addToCart, updateQuantity, clearCart, removeFromCart } = useCart();
  const { book } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [total, setTotal] = useState(0);

  // Corrected Book interface
  interface Book {
    id: string;
    title: string;
    author: string;
    price?: number;  // 'price' is optional
    image: string | { uri: string };
  }

  // Adding the book to the cart when entering the page
  useEffect(() => {
    if (book) {
      addToCart(book);
    }
  }, [book]);

  // Calculating the total of the cart
  useEffect(() => {
    const cartTotal = cart.reduce((sum, item) => sum + (item.price ? item.price : 0) * item.quantity, 0); // Handling undefined price
    setTotal(cartTotal);
  }, [cart]);

  // Function to show the modal and clear the cart
  const handleValidation = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
      clearCart();
      navigation.goBack();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
       
        <Text style={styles.title}>Clean Cart</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={22} color="#ff3b30" />
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCart}>Your cart is empty.</Text>
          <TouchableOpacity 
            style={styles.continueShopping} 
            onPress={() => navigation.navigate('BookList')}
          >
            <Text style={styles.continueShoppingText}>Continue shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image 
                  source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                  style={styles.image} 
                  resizeMode="cover"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.author}>{item.author}</Text>
                  <Text style={styles.price}>{item.price ? `${item.price.toFixed(2)} TND` : 'Prix non disponible'}</Text>
                  
                  <View style={styles.bottomRow}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={[styles.buttonQuantity, item.quantity <= 1 && styles.buttonDisabled]}
                        onPress={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
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
                    
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons name="close-circle" size={22} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Subtotal</Text>
              <Text style={styles.summaryValue}>{total.toFixed(2)} TND</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Delivery</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} TND</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleValidation}>
            <Text style={styles.checkoutButtonText}>Validate my order</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {/* Modal for validation */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.modalText}>Order successfully validated!</Text>
            <Text style={styles.modalSubText}>Thank you for your purchase !</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: 'green',
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonQuantity: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b0d0ff',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3498db',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCart: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  continueShopping: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#007bff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4cd964',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  modalSubText: {
    fontSize: 14,
    color: '#666',
  },
});
