import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


function EditScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Edit!</Text>
    </View>
  );
}

export default EditScreen;
