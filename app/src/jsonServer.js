import axios from 'axios';

const JSON_SERVER_URL = 'http://192.168.1.8:5000/books';

export const createBookJSON = async (bookData) => {
  try {
    
    await axios.post(JSON_SERVER_URL, bookData);
    console.log("Livre ajouté à JSON Server");
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre à JSON Server :", error);
    throw error;
  }
};
export const readAllBooksJSON = async () => {
    try {
      const response = await axios.get(JSON_SERVER_URL);
      // Convertir les IDs en nombres si nécessaire
      const books = response.data.map(book => ({
        ...book,
        id: parseInt(book.id, 10)  // Conversion explicite de l'ID en nombre
      }));
      return books;
    } catch (error) {
      console.error("Erreur lors de la récupération des livres depuis JSON Server :", error);
      throw error;
    }
  };
  
export const updateBookJSON = async (id, bookData) => {
    try {
        id = parseInt(id, 10); // Convertir l'ID en nombre

      await axios.put(`${JSON_SERVER_URL}/${id}`, bookData);
      console.log("Livre mis à jour dans JSON Server");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre dans JSON Server :", error);
      throw error;
    }
  };
export const deleteBookJSON = async (bookId) => {
    try {
        const id = parseInt(bookId, 10);  // Convertir l'ID en nombre

      const url = `${JSON_SERVER_URL}/${id}`;
      console.log("URL de suppression JSON Server :", url);
  
      // Vérifier si le livre existe
      const response = await axios.get(url);
      if (response.data) {
        // Supprimer le livre
        await axios.delete(url);
        console.log("Livre supprimé de JSON Server :", response.data);
        return true;
      } else {
        console.log("Le livre n'existe pas dans JSON Server");
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre dans JSON Server :", error);
      throw error;
    }
  };
