import React from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const clearStorage = async () => {
  await AsyncStorage.clear();
  Alert.alert("Storage has been cleared.");
};

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Button title="Clear storage" onPress={clearStorage} />
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
});
