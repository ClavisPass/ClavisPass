import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import WebSpecific from "./platformSpecific/WebSpecific";
import theme from "../ui/theme";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  innercontainer: {
    padding: 10,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  draggable: {
    borderWidth: 1,
    borderRadius: 6,
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
    //borderLeftWidth: 1,
    //borderColor: "lightgrey",
    //marginLeft: 6,
  },
});

type Props = {
  id: string;
  children: ReactNode;
  title: string;
  edit: boolean;
  delete: boolean;
  onDragStart?: () => void;
  deleteModule?: (id: string) => void;
};

function ModuleContainer(props: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        {props.edit ? (
          <>
            {Platform.OS === "web" ? (
              <Icon source="drag" color={theme.colors.primary} size={20} />
            ) : (
              <Pressable onPressIn={props.onDragStart}>
                <Icon source="drag" color={theme.colors.primary} size={20} />
              </Pressable>
            )}
          </>
        ) : null}

        <View style={styles.content}>
          <Text variant="bodyMedium" style={{ userSelect: "none" }}>
            {props.title}
          </Text>
          {props.children}
        </View>
      </View>
      {props.delete ? (
        <>
          <View style={styles.delete}>
            <IconButton
              style={{ margin: 0 }}
              icon="close"
              iconColor={theme.colors.error}
              size={20}
              onPress={() => props.deleteModule?.(props.id)}
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

export default ModuleContainer;
