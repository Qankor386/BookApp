import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function TodoListScreen() {
  const [books, setBooks] = useState<string[]>([]);
  const [newBook, setNewBook] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadBooks = async () => {
        const storedBooks = await AsyncStorage.getItem("todoBooks");
        if (storedBooks) setBooks(JSON.parse(storedBooks));
      };
      loadBooks();
    }, [])
  );

  const addBook = async () => {
    if (newBook.trim() === "") return;
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    await AsyncStorage.setItem("todoBooks", JSON.stringify(updatedBooks));
    setNewBook("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Book list</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Write a book name" 
        value={newBook} 
        onChangeText={setNewBook} 
      />
      <Button title="Add" onPress={addBook} />
      <FlatList 
        data={books} 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item }) => <Text style={styles.book}>{item}</Text>} 
      />
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
      fontSize: 20, 
      fontWeight: "bold", 
      color: "#FFFFFF"
    },
    input: { 
      width: "80%", 
      padding: 10, 
      borderWidth: 1, 
      marginVertical: 10, 
      color: "#FFFFFF",
      borderColor: "#FFFFFF",
      backgroundColor: "#1E1E1E"
    },
    book: {
      fontSize: 18,
      color: "#FFFFFF",
      marginVertical: 5
    }
  });
