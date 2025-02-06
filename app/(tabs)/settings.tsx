import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStorage } from "../../hooks/StorageContext";

export default function SettingsScreen() {
  const { refreshStorage } = useStorage();
  const [modalVisible, setModalVisible] = useState(false);

  const confirmClearStorage = async () => {
    await AsyncStorage.clear();
    refreshStorage();
    setModalVisible(false);
    Alert.alert("Storage has been cleared.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <TouchableOpacity style={styles.clearButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>CLEAR STORAGE</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.infoText}>Manage your app storage and preferences.</Text>
      </View>

      {/* CONFIRMATION MODAL */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalText}>This will delete all saved data and cannot be undone.</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={confirmClearStorage}>
                <Text style={styles.buttonText}>YES, DELETE</Text>
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
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 30,
    marginBottom: 30,
  },
  clearButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  infoText: {
    color: "#BBBBBB",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  /* MODAL STYLES */
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#BBBBBB",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#007bff",
    padding: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
  },
});
