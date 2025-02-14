import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import BookList from './booklist';
import DetailsBook from './detailsbook';
import AjoutPanier from './ajoutpanier';
import { CartProvider } from './cartprovider';
import AddBookForm from './(admin)/addBookForm';
import Books from './(admin)/books';
import UpdateBookForm from './(admin)/updateBookForm';


SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [loaded]);

  if (!appIsReady || !loaded) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require('../assets/images/splash-book.png')} style={styles.splashImage} />
      </View>
    );
  }

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName='Books' >
          <Stack.Screen name="BookList" component={BookList}  />
          <Stack.Screen name="DetailsBook" component={DetailsBook} />
          <Stack.Screen name="AjoutPanier" component={AjoutPanier} />
          <Stack.Screen name="AddBook" component={AddBookForm} />
          <Stack.Screen name="UpdateBook" component={UpdateBookForm} />
          <Stack.Screen name="Books" component={Books} />


        </Stack.Navigator>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
