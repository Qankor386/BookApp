import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Book } from "../../constants/Book";

export default function HomeScreen() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const router = useRouter();

  useFocusEffect(
  useCallback(() => {
    const loadCurrentBook = async () => {
      const book = await AsyncStorage.getItem("currentBook");
      if (book) {
        const parsedBook = JSON.parse(book);
        parsedBook.addedDate = new Date(parsedBook.addedDate).toLocaleDateString("cs-CZ");
        setCurrentBook(parsedBook);
      }
    };
    loadCurrentBook();
  }, [])
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Reading:</Text>
      {currentBook ? (
        <View style={styles.bookContainer}>
          <Text style={styles.bookTitle}>{currentBook.title}</Text>
          {currentBook.series && <Text style={styles.bookSeries}>Series: {currentBook.series}</Text>}
          <Text style={styles.bookAuthor}>Author: {currentBook.author || "---"}</Text>
          <Text style={styles.bookDate}>Published Date: {currentBook.releaseDate}</Text>
          <Text style={styles.bookAdded}>Book Added: {currentBook.addedDate}</Text>
        </View>
      ) : (
        <Text style={styles.noBook}>No book has been added</Text>
      )}
      <Button title="Add New Book" onPress={() => router.push("/edit")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  title: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  bookContainer: { alignItems: "center", marginVertical: 10 },
  bookTitle: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF" },
  bookSeries: { fontSize: 18, fontStyle: "italic", color: "#CCCCCC" },
  bookAuthor: { fontSize: 18, color: "#FFFFFF" },
  bookRating: { fontSize: 18, color: "#FFD700" },
  bookDate: { fontSize: 16, color: "#AAAAAA" },
  bookAdded: { fontSize: 16, color: "#AAAAAA" },
  noBook: { fontSize: 18, color: "#FFFFFF", fontStyle: "italic" },
});
