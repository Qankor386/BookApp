import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [currentBook, setCurrentBook] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCurrentBook = async () => {
      const book = await AsyncStorage.getItem("currentBook");
      if (book) setCurrentBook(book);
    };
    loadCurrentBook();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Now reading:</Text>
      <Text style={styles.book}>{currentBook || "You are not reading any book. Please select new book to read."}</Text>
      <Button title="Edit book" onPress={() => router.push("/edit")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#FFFFFF"
  },
  book: { 
    fontSize: 18, 
    marginVertical: 10, 
    color: "#FFFFFF"
  }
});