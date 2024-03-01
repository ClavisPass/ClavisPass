import React from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar, Text, Button, ActivityIndicator } from "react-native-paper";

import { StatusBar } from "expo-status-bar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button icon="camera" mode="contained" onPress={() => location.reload()}>
        Press me please
      </Button>
      <ActivityIndicator animating={true} size={"large"} />
    </View>
  );
}

export default HomeScreen;
