import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Book } from "../../constants/Book";

export default function EditBookScreen() {
  const [book, setBook] = useState<Book>({
    title: "",
    series: "",
    author: "",
    releaseDate: "",
    addedDate: new Date().toISOString(),
  });
  const router = useRouter();

  const saveBook = async () => {
    await AsyncStorage.setItem("currentBook", JSON.stringify(book));
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Name:</Text>
      <TextInput style={styles.input} value={book.title} onChangeText={(text) => setBook({ ...book, title: text })} />

      <Text style={styles.title}>Series:</Text>
      <TextInput style={styles.input} value={book.series} onChangeText={(text) => setBook({ ...book, series: text })} />

      <Text style={styles.title}>Author:</Text>
      <TextInput style={styles.input} value={book.author} onChangeText={(text) => setBook({ ...book, author: text })} />

      <Text style={styles.title}>Release Date:</Text>
      <TextInput style={styles.input} value={book.releaseDate} onChangeText={(text) => setBook({ ...book, releaseDate: text })} />

      <Button title="Save Book" onPress={saveBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#121212"
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
    borderColor: "#FFFFFF"
  },
});
