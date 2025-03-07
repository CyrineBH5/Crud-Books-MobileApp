import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { initDatabase, readBook, updateBook } from '../src/database'; // Importez readBook et updateBook

export default function UpdateBookForm({ route, navigation }: { route: any; navigation: any }) {
  const { bookId } = route.params;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Charger les détails du livre à mettre à jour
  // useEffect(() => {
  //   const loadBookDetails = async () => {
  //     try {
  //       const db = await initDatabase();
  //       const book = await readBook(db, bookId);
  //       if (book) {
  //         setTitle(book.title);
  //         setAuthor(book.author);
  //         setYear(new Date(book.year, 0, 1)); // Convertir l'année en Date
  //         setDescription(book.description);
  //         setPrice(book.price.toString());
  //         setImage(book.image);
  //       }
  //     } catch (error) {
  //       console.error("Erreur lors du chargement des détails du livre :", error);
  //       Alert.alert('Erreur', "Une erreur s'est produite lors du chargement des détails du livre");
  //     }
  //   };

  //   loadBookDetails();
  // }, [bookId]);
  useEffect(() => {
    const loadBookDetails = async () => {
      try {
        const db = await initDatabase();
        const book = await readBook(db, bookId);
        if (book) {
          setTitle(book.title);
          setAuthor(book.author);
  
          // Gérer l'année
          const yearValue = parseInt(book.year, 10);
          if (!isNaN(yearValue)) {
            setYear(new Date(yearValue, 0, 1)); 
          } else {
            setYear(new Date()); 
          }
  
          setDescription(book.description);
          setPrice(book.price.toString());
          setImage(book.image);
        } else {
          console.log("Livre non trouvé");
          Alert.alert('Erreur', 'Le livre demandé n\'existe pas');
          navigation.goBack(); 
        }
      } catch (error) {
        console.error("Erreur lors du chargement des détails du livre :", error);
        Alert.alert('Erreur', "Une erreur s'est produite lors du chargement des détails du livre");
      }
    };
  
    loadBookDetails();
  }, [bookId]);

  // Fonction pour sélectionner une image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour sélectionner une image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setYear(selectedDate);
    }
  };

  // const handleUpdateBook = async () => {
  //   if (!title || !author || !year || !description || !price) {
  //     Alert.alert('Erreur', 'Veuillez remplir tous les champs');
  //     return;
  //   }

  //   const db = await initDatabase();
  //   if (db) {
  //     try {
  //       const priceNumber = parseFloat(price);
  //       if (isNaN(priceNumber)) {
  //         Alert.alert('Erreur', 'Le prix doit être un nombre');
  //         return;
  //       }

  //       await updateBook(db, bookId, title, author, year.getFullYear(), description, priceNumber, image);
  //       Alert.alert('Succès', 'Livre mis à jour avec succès');
  //       navigation.navigate('Books'); // Rediriger vers la liste des livres
  //     } catch (error) {
  //       console.error("Erreur lors de la mise à jour du livre :", error);
  //       Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du livre');
  //     }
  //   }
  // };
  const handleUpdateBook = async () => {
    if (!title || !author || !year || !description || !price) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
  
    const db = await initDatabase();
    if (db) {
      try {
        const priceNumber = parseFloat(price);
        if (isNaN(priceNumber)) {
          Alert.alert('Erreur', 'Le prix doit être un nombre');
          return;
        }
        
        console.log("start update ");
        
        // Effectuer la mise à jour
        const updatedBook = await updateBook(db, bookId, title, author, year.getFullYear(), description, priceNumber, image);
        console.log("updateBook called", updatedBook);  // Vérifier que la méthode update est bien appelée
        
        Alert.alert('Succes', 'Book updated succefully');
        navigation.navigate('Books', { shouldRefresh: true });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du livre :", error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du livre');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="pencil" size={32} color="#3498db" />
        <Text style={styles.headerText}>Update a Book </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Titre du livre"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Auteur du livre"
        value={author}
        onChangeText={setAuthor}
      />
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <View style={styles.datePickerContent}>
          <Text style={styles.datePickerText}>
            {year ? year.toISOString().split('T')[0] : 'Sélectionner une date'}
          </Text>
          <Ionicons name="calendar" size={24} color="#3498db" />
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={year || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <View style={styles.priceContainer}>
        <TextInput
          style={[styles.input, styles.priceInput]}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <View style={styles.iconInsideInput}>
          <Text style={styles.tndText}>TND</Text>
        </View>
      </View>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <View style={styles.imagePickerContent}>
          <Ionicons name="image" size={24} color="#3498db" style={styles.imagePickerIcon} />
          <Text style={styles.imagePickerText}>
            {image ? 'Change image' : 'Select an image'}
          </Text>
        </View>
      </TouchableOpacity>
      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
        </View>
      )}
      <Button title="Edit Book"color='#3498db' onPress={handleUpdateBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#3498db',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  priceInput: {
    flex: 1,
    paddingRight: 40,
  },
  iconInsideInput: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  tndText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#009bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imagePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePickerIcon: {
    marginRight: 10,
    color: '#3498db',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '40%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});