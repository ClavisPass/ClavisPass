import React, { ReactNode } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";
import FastAccessType from "../../types/FastAccessType";
import { EditRowControlsContainer } from "./EditRowControlsContainer";

const moduleStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  inner: {
    padding: 10,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
});

export type ModuleContainerProps = {
  id: string;
  children: ReactNode;
  title: string;
  edit: boolean;
  deletable?: boolean;
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
  edit,
  deletable = true,
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
      edit={edit}
      onDragStart={onDragStart}
      onDelete={deletable ? deleteModule : undefined}
      style={[
        moduleStyles.container,
        moduleStyles.inner,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: (theme.colors as any)?.shadow,
          ...(Platform.OS !== "web" ? { marginBottom: 8 } : {}),
          borderRadius: 12,
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
            height: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            {icon ? (
              <Icon source={icon} size={16} color={theme.colors?.primary} />
            ) : null}

            <Pressable
              onPress={titlePress}
              style={{ cursor: titlePress ? "pointer" : "auto" }}
            >
              <Text
                variant="bodyMedium"
                style={{
                  userSelect: "none",
                  color: theme.colors?.primary,
                  margin: 0,
                }}
              >
                {title}
              </Text>
            </Pressable>

            {(id === fastAccess?.usernameId || id === fastAccess?.passwordId) &&
            edit ? (
              <Icon
                source={"tooltip-account"}
                size={16}
                color={theme.colors?.primary}
              />
            ) : null}
          </View>

          {modal}
        </View>
        {children}
      </View>
    </EditRowControlsContainer>
  );
}
