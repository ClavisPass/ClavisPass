import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text } from "react-native-paper";
import globalStyles from "../ui/globalStyles";

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
  },
});

function SettingsScreen() {
  return (
    <View style={globalStyles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Surface style={styles.surface} elevation={1}>
          <Text>Surface</Text>
        </Surface>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
