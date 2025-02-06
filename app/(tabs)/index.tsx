import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Book } from "../../constants/Book";
import { useStorage } from "../../hooks/StorageContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { triggerReload, refreshStorage } = useStorage();

  const [newBook, setNewBook] = useState<Book>({
    title: "",
    series: "",
    author: "",
    releaseDate: "",
    addedDate: new Date().toISOString(),
  });

  useFocusEffect(
    useCallback(() => {
      const loadBooks = async () => {
        const storedBooks = await AsyncStorage.getItem("reading_books");

        if (storedBooks) setBooks(JSON.parse(storedBooks));
        else setBooks([]);
      };
      loadBooks();
    }, [triggerReload])
  );

  const addBook = async () => {
    if (newBook.title.trim() === "") return;
    const updatedBooks = [...books, newBook];

    setBooks(updatedBooks);
    await AsyncStorage.setItem("reading_books", JSON.stringify(updatedBooks));

    setNewBook({ title: "", series: "", author: "", releaseDate: "", addedDate: new Date().toISOString() });

    setModalVisible(false);
    refreshStorage();
  };

  const deleteBook = async (index: number) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
    await AsyncStorage.setItem("reading_books", JSON.stringify(updatedBooks));
    refreshStorage();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Reading:</Text>

      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookInfo}>
              <Text style={styles.bookLabel}>Name: <Text style={styles.bookTitle}>{item.title}</Text></Text>
              {item.series && <Text style={styles.bookLabel}>Series: <Text style={styles.bookSeries}>{item.series}</Text></Text>}
              <Text style={styles.bookLabel}>Author: <Text style={styles.bookText}>{item.author}</Text></Text>
              <Text style={styles.bookLabel}>Added Date: <Text style={styles.bookText}>{new Date(item.addedDate).toLocaleDateString("cs-CZ")}</Text></Text>
            </View>

            <TouchableOpacity onPress={() => deleteBook(index)} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={24} color="#d9534f" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>ADD NEW BOOK</Text>
          </TouchableOpacity>
        }
      />

      {/* MODAL FORM */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Book</Text>
            <TextInput style={styles.input} placeholder="Title" value={newBook.title} onChangeText={(text) => setNewBook({ ...newBook, title: text })} />
            <TextInput style={styles.input} placeholder="Series" value={newBook.series} onChangeText={(text) => setNewBook({ ...newBook, series: text })} />
            <TextInput style={styles.input} placeholder="Author" value={newBook.author} onChangeText={(text) => setNewBook({ ...newBook, author: text })} />

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
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#FFFFFF",
    marginTop: 30,
    marginBottom: 20
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  bookInfo: {
    flex: 1,
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
  deleteButton: {
    padding: 10,
    marginLeft: 50
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: 200,
    alignItems: "center",
    alignSelf: "center"
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16
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
  input: { 
    width: "100%", 
    padding: 10, 
    borderWidth: 1, 
    marginVertical: 10, 
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    backgroundColor: "#1E1E1E"
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
  }
});