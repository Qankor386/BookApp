import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditBookScreen() {
  const [book, setBook] = useState("");
  const router = useRouter();

  const saveBook = async () => {
    await AsyncStorage.setItem("currentBook", book);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Název knihy:</Text>
      <TextInput style={styles.input} value={book} onChangeText={setBook} />
      <Button title="Uložit" onPress={saveBook} />
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
