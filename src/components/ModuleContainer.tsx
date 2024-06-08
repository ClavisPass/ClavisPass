import React, { ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Divider, Icon, IconButton, Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
  },
  draggable: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "lightgrey",
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
    borderLeftWidth: 1,
    marginLeft: 6,
    borderColor: "gray",
  },
});

type Props = {
  children: ReactNode;
  title: string;
  edit: boolean;
  delete: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
};

function ModuleContainer(props: Props) {
  return (
    <>
      <View style={styles.container}>
        {props.edit ? (
          <TouchableOpacity
            key={props.title}
            onPressIn={props.onDragStart}
            onPressOut={props.onDragEnd}
            style={styles.draggable}
          >
            <Icon source="drag" size={20} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.content}>
          <Text variant="bodyMedium">{props.title}</Text>
          {props.children}
        </View>
        {props.delete ? (
          <>
            <View style={styles.delete}>
              <IconButton
                icon="delete"
                size={20}
                onPress={() => console.log("Pressed")}
              />
            </View>
          </>
        ) : null}
      </View>
    </>
  );
}

export default ModuleContainer;
