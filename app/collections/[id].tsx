import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { AirbnbRating } from "react-native-ratings";
import { Book } from "../../constants/Book";
import { useNavigation } from "@react-navigation/native";

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBook, setNewBook] = useState<Book>({
    title: "",
    series: "",
    author: "",
    releaseDate: "",
    rating: 0,
    review: "",
    addedDate: new Date().toISOString(),
  });
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Collections" });
  }, [navigation]);

  useEffect(() => {
    const loadBooks = async () => {
      const storedBooks = await AsyncStorage.getItem(`collection_${id}`);
      if (storedBooks) setBooks(JSON.parse(storedBooks));
    };
    loadBooks();
  }, [id]);

  const addBook = async () => {
    if (newBook.title.trim() === "") return;
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    await AsyncStorage.setItem(`collection_${id}`, JSON.stringify(updatedBooks));
    setNewBook({ title: "", series: "", author: "", releaseDate: "", rating: 0, review: "", addedDate: new Date().toISOString() });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.collectionTitle}>📚 {id}</Text>
      <FlatList 
        data={books} 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookLabel}>Name: <Text style={styles.bookTitle}>{item.title}</Text></Text>
            {item.series && <Text style={styles.bookLabel}>Series: <Text style={styles.bookSeries}>{item.series}</Text></Text>}
            <Text style={styles.bookLabel}>Author: <Text style={styles.bookText}>{item.author}</Text></Text>
            <Text style={styles.bookLabel}>Release Date: <Text style={styles.bookText}>{item.releaseDate}</Text></Text>
            <Text style={styles.bookLabel}>Rating: <Text style={styles.starRating}>{"★".repeat(item.rating || 0)}</Text></Text>
            <Text style={styles.bookLabel}>Review: <Text style={styles.bookText}>{item.review}</Text></Text>
          </View>
        )}
      />

      <Button title="Add Book" onPress={() => setModalVisible(true)} />
      
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Book</Text>
            <TextInput style={styles.input} placeholder="Title" value={newBook.title} onChangeText={(text) => setNewBook({ ...newBook, title: text })} />
            <TextInput style={styles.input} placeholder="Series" value={newBook.series} onChangeText={(text) => setNewBook({ ...newBook, series: text })} />
            <TextInput style={styles.input} placeholder="Author" value={newBook.author} onChangeText={(text) => setNewBook({ ...newBook, author: text })} />
            <TextInput style={styles.input} placeholder="Release Date" value={newBook.releaseDate} onChangeText={(text) => setNewBook({ ...newBook, releaseDate: text })} />
            
            <View style={styles.ratingContainer}>
              <Text style={styles.bookLabel}>Rating:</Text>
              <AirbnbRating
                count={5}
                defaultRating={newBook.rating}
                size={25}
                showRating={false}
                onFinishRating={(rating) => setNewBook({ ...newBook, rating })}
              />
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Review"
              multiline={true}
              numberOfLines={3}
              value={newBook.review}
              onChangeText={(text) => setNewBook({ ...newBook, review: text })}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={addBook}>
                <Text style={styles.buttonText}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#121212",
    padding: 20
  },
  collectionTitle: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FFFFFF",
    marginBottom: 20
  },
  bookItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    width: "100%"
  },
  bookLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  bookSeries: { fontStyle: "italic", color: "#CCCCCC" },
  bookText: { color: "#CCCCCC" },
  starRating: { color: "#FFD700", fontSize: 18 },
  input: { 
    width: "100%", 
    padding: 10, 
    borderWidth: 1, 
    marginVertical: 10, 
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    backgroundColor: "#1E1E1E"
  },
  reviewInput: { 
    width: "100%", 
    padding: 10, 
    borderWidth: 1, 
    marginVertical: 10, 
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    backgroundColor: "#1E1E1E",
    height: 80,
    textAlignVertical: "top"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%"
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginVertical: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    borderRadius: 5
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 5
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  }
});
