import { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Modal, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useStorage } from "../../hooks/StorageContext";

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<string[]>([]);
  const [bookCounts, setBookCounts] = useState<{ [key: string]: number }>({});
  const [newCollection, setNewCollection] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { triggerReload, refreshStorage } = useStorage();

  const loadCollections = async () => {
    const storedCollections = await AsyncStorage.getItem("collections");
    if (storedCollections) {
      const parsedCollections = JSON.parse(storedCollections);
      setCollections(parsedCollections);

      const counts: { [key: string]: number } = {};
      for (const collection of parsedCollections) {
        const storedBooks = await AsyncStorage.getItem(`collection_${collection}`);
        counts[collection] = storedBooks ? JSON.parse(storedBooks).length : 0;
      }
      setBookCounts(counts);
    }else {
        setCollections([]);
        setBookCounts({});
      }
  };

  useEffect(() => {
    loadCollections();
  }, [triggerReload]);

  useFocusEffect(
    useCallback(() => {
      loadCollections();
    }, [])
  );

  const addCollection = async () => {
    if (newCollection.trim() === "") return;
    const updatedCollections = [...collections, newCollection];

    setCollections(updatedCollections);
    await AsyncStorage.setItem("collections", JSON.stringify(updatedCollections));

    setNewCollection("");
    setModalVisible(false);
    refreshStorage();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Book Collections</Text>

      <FlatList
        data={collections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/collections/${encodeURIComponent(item)}`)}>
            <View style={styles.collectionItem}>
              <Text style={styles.collectionTitle}>{item}</Text>
              <Text style={styles.collectionSub}>Number of books: {bookCounts[item] || 0}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>CREATE NEW COLLECTION</Text>
          </TouchableOpacity>
        }
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Collection Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter collection name"
              value={newCollection}
              onChangeText={setNewCollection}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={addCollection}>
                <Text style={styles.buttonText}>CREATE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
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
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 30,
    marginBottom: 20,
  },
  collectionItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%", 
    minHeight: 100, 
    alignSelf: "center",
  },
  collectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  collectionSub: {
    fontSize: 16,
    color: "#BBBBBB",
    marginTop: 5,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    backgroundColor: "#1E1E1E",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
  },
});
