import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});

type Props = {
  children: ReactNode;
  title: string;
};

function ModuleContainer(props: Props) {
  return (
    <>
      <View style={styles.container}>
        <Text variant="bodyMedium">{props.title}</Text>
        {props.children}
        <Divider />
      </View>
    </>
  );
}

export default ModuleContainer;
