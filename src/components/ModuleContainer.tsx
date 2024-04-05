import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Icon, IconButton, Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    display: "flex",
    flexDirection: "row",
  },
  draggable: {
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  content: {
    flex: 1,
  },
  delete: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

type Props = {
  children: ReactNode;
  title: string;
  edit: boolean;
};

function ModuleContainer(props: Props) {
  return (
    <>
      <View style={styles.container}>
        {props.edit ? (
          <View style={styles.draggable}>
            <Icon source="drag" size={20} />
          </View>
        ) : null}

        <View style={styles.content}>
          <Text variant="bodyMedium">{props.title}</Text>
          {props.children}
        </View>
        {props.edit ? (
          <View style={styles.delete}>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => console.log("Pressed")}
            />
          </View>
        ) : null}
      </View>
    </>
  );
}

export default ModuleContainer;
