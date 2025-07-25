import React, { ReactNode, useEffect } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeProvider";
import FastAccessType from "../../types/FastAccessType";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  innercontainer: {
    padding: 10,
    marginLeft: 8,
    marginRight: 8,
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
    paddingLeft: 6,
  },
  delete: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  modal?: ReactNode;
  icon?: string;
  titlePress?: () => void;
  fastAccess: FastAccessType | null;
};

function ModuleContainer(props: Props) {
  const { theme } = useTheme();
  const translateX = useSharedValue(-20);
  const paddingLeft = useSharedValue(4);
  const paddingRight = useSharedValue(4);
  const translateXDelete = useSharedValue(46);
  useEffect(() => {
    if (props.edit) {
      translateX.value = withTiming(0, { duration: 150 });
      paddingLeft.value = withTiming(24, { duration: 150 });
      paddingRight.value = withTiming(50, { duration: 150 });
      translateXDelete.value = withTiming(0, { duration: 150 });
    } else {
      translateX.value = withTiming(-20, { duration: 150 });
      paddingLeft.value = withTiming(4, { duration: 150 });
      paddingRight.value = withTiming(4, { duration: 150 });
      translateXDelete.value = withTiming(46, { duration: 150 });
    }
  }, [props.edit]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 4,
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedIconStyleDelete = useAnimatedStyle(() => {
    return {
      position: "absolute",
      right: 4,
      transform: [{ translateX: translateXDelete.value }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      overflow: "hidden",
      paddingLeft: paddingLeft.value,
      paddingRight: paddingRight.value,
    };
  });
  return (
    <Animated.View
      key={props.id}
      style={[
        styles.container,
        styles.innercontainer,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
        },
        animatedContainerStyle,
        Platform.OS !== "web" && {
          marginBottom: 8,
        },
      ]}
    >
      <Animated.View style={animatedIconStyle}>
        {Platform.OS === "web" ? (
          <Icon source="drag" color={theme.colors?.primary} size={20} />
        ) : (
          <Pressable onPressIn={props.edit ? props.onDragStart : undefined}>
            <Icon source="drag" color={theme.colors?.primary} size={20} />
          </Pressable>
        )}
      </Animated.View>
      <View style={[styles.content]}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            height: 20,
            width: "100%",
            //justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            {props.icon ? (
              <Icon
                source={props.icon}
                size={16}
                color={theme.colors?.primary}
              />
            ) : null}
            <Pressable
              onPress={props.titlePress}
              style={{ cursor: props.titlePress ? "pointer" : "auto" }}
            >
              <Text
                variant="bodyMedium"
                style={{
                  userSelect: "none",
                  color: theme.colors?.primary,
                  margin: 0,
                }}
              >
                {props.title}
              </Text>
            </Pressable>
            {(props.id === props.fastAccess?.usernameId ||
            props.id === props.fastAccess?.passwordId) && props.edit ? (
              <Icon
                source={"tooltip-account"}
                size={16}
                color={theme.colors?.primary}
              />
            ) : null}
          </View>
          {props.modal}
        </View>
        {props.children}
      </View>
      <Animated.View style={[styles.delete, animatedIconStyleDelete]}>
        <IconButton
          animated={true}
          selected={props.edit}
          mode="contained-tonal"
          icon="close"
          iconColor={theme.colors?.error}
          size={20}
          onPress={() => props.deleteModule?.(props.id)}
        />
      </Animated.View>
    </Animated.View>
  );
}

export default ModuleContainer;
