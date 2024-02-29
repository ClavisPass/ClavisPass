import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";

import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: "#0096fe",
  },
};

export default function App() {
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
        <Button
          icon="camera"
          mode="contained"
          onPress={() => location.reload()}
        >
          Press me please
        </Button>
        <ActivityIndicator animating={true} size={'large'}/>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
