import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { books } from '@/constants/MenuItems';
import { useNavigation } from '@react-navigation/native';


const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

export default function BookList({ navigation }: { navigation: any }) {

  // const renderBook = ({ item }: { item: Book }) => (
  //   <Pressable
  //     style={styles.card}
  //     onPress={() => navigation.navigate('DetailsBook', { book: item })} 
  //     android_ripple={{ color: '#ddd' }}  
      
  //   >
  //     <Image 
  //       source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
  //       style={styles.image} 
  //     />
  //     <View style={styles.textContainer}>
  //       <Text style={styles.title}>{item.title}</Text>
  //       <Text style={styles.author}>{item.author}</Text>
  //       <View style={styles.dateContainer}>
  //         <Ionicons name="calendar-outline" size={16} color="#888" />
  //         <Text style={styles.date}>{item.date}</Text>
  //       </View>
  //     </View>
  //   </Pressable>
  // );

  return (
    <Container>
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => ( 
        <Pressable
          style={styles.card}
           onPress={() => navigation.navigate('DetailsBook', { book: item })} 
          android_ripple={{ color: '#ddd' }}  
        >
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
            style={styles.image} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        </Pressable>
      )}
      contentContainerStyle={styles.list}
    />
  </Container>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#f9f9f9',
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
    height: 90,
    borderRadius: 10,
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
    color: '#555',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
});
