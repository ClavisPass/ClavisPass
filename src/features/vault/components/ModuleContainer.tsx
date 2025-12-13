import React, { ReactNode } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import FastAccessType from "../../fastaccess/model/FastAccessType";
import { EditRowControlsContainer } from "./EditRowControlsContainer";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";

const moduleStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  inner: {
    //padding: 10,
    paddingTop: 0,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
});

export type ModuleContainerProps = {
  id: string;
  children: ReactNode;
  title: string;
  onDragStart?: () => void;
  deleteModule?: (id: string) => void;
  modal?: ReactNode;
  icon?: string;
  titlePress?: () => void;
  fastAccess: FastAccessType | null;
};

export default function ModuleContainer({
  id,
  children,
  title,
  onDragStart,
  deleteModule,
  modal,
  icon,
  titlePress,
  fastAccess,
}: ModuleContainerProps) {
  const { theme } = useTheme();

  return (
    <EditRowControlsContainer
      id={id}
      onDragStart={onDragStart}
      onDelete={deleteModule}
      style={[
        moduleStyles.container,
        moduleStyles.inner,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: (theme.colors as any)?.shadow,
          ...(Platform.OS !== "web" ? { marginBottom: 8 } : {}),
          borderRadius: 12,
          overflow: "hidden",
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            width: "100%",
          }}
        >
          <AnimatedPressable
            style={{
              padding: 8,
              paddingLeft: 8,
              paddingRight: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
              overflow: "hidden",
            }}
            onPress={titlePress}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              {icon ? (
                <Icon source={icon} size={18} color={theme.colors?.primary} />
              ) : null}

              <Text>{title}</Text>

              {id === fastAccess?.usernameId ||
              id === fastAccess?.passwordId ? (
                <Icon
                  source={"tooltip-account"}
                  size={14}
                  color={theme.colors?.primary}
                />
              ) : null}
            </View>
          </AnimatedPressable>
          {modal}
        </View>
        <Divider />
        <View style={{ flex: 1, padding: 8 }}>{children}</View>
      </View>
    </EditRowControlsContainer>
  );
}
