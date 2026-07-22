import React, { useCallback, useMemo, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import { Icon, IconButton, Text } from "react-native-paper";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import { useTranslation } from "react-i18next";

import { useTheme } from "../app/providers/ThemeProvider";
import { HomeStackParamList } from "../app/navigation/model/types";
import ModulesType, { ModuleType } from "../features/vault/model/ModulesType";
import { MODULE_ICON } from "../features/vault/model/ModuleIconsEnum";
import ModulesEnum from "../features/vault/model/ModulesEnum";
import getModuleNameByEnum from "../features/vault/utils/getModuleNameByEnum";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { TITLEBAR_HEIGHT } from "../shared/components/CustomTitlebar";
import getColors from "../shared/ui/linearGradient";
import AnimatedPressable from "../shared/components/AnimatedPressable";

type ModuleReorderScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "ModuleReorder"
>;

const styles = StyleSheet.create({
  item: {
    height: 44,
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  dragHandle: {
    width: 32,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
  },
});
const webNoDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "no-drag",
        appRegion: "no-drag",
      } as any)
    : null;

const VerticalReorderIcon = ({
  color,
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View style={{ height: size / 2, marginBottom: -2 }}>
      <Icon source="chevron-up" size={size * 0.72} color={color} />
    </View>
    <View style={{ height: size / 2, marginTop: -2 }}>
      <Icon source="chevron-down" size={size * 0.72} color={color} />
    </View>
  </View>
);

function moveModule(
  modules: ModulesType,
  sourceIndex: number,
  destinationIndex: number,
) {
  const next = [...modules];
  const [removed] = next.splice(sourceIndex, 1);
  if (!removed) return modules;
  next.splice(destinationIndex, 0, removed);
  return next as ModulesType;
}

export default function ModuleReorderScreen({
  route,
  navigation,
}: ModuleReorderScreenProps) {
  const {
    theme,
    darkmode,
    globalStyles,
    setHeaderSpacing,
    setHeaderWhite,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<ModulesType>(route.params.modules);

  const headerTop =
    Constants.statusBarHeight + (TITLEBAR_HEIGHT > 0 ? 4 : 6);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(true);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);

      return () => setTitlebarOverlayDragEnabled(true);
    }, [
      setHeaderSpacing,
      setHeaderWhite,
      setTitlebarCenterGap,
      setTitlebarOverlayDragEnabled,
    ]),
  );

  React.useEffect(() => {
    if (Platform.OS !== "web") return;

    document
      .getElementById("module-reorder-header-drag-region")
      ?.setAttribute("data-tauri-drag-region", "");
  }, []);

  const renderModuleItem = useCallback(
    (
      item: ModuleType,
      index: number,
      onDragStart?: () => void,
      dragHandleProps?: any,
    ) => {
      const moduleKind = (item.module ?? ModulesEnum.UNKNOWN) as ModulesEnum;
      const icon = MODULE_ICON[moduleKind] ?? MODULE_ICON[ModulesEnum.UNKNOWN];
      const label = getModuleNameByEnum(moduleKind, t);
      const dragIconColor = darkmode
        ? theme.colors.outline
        : theme.colors.outlineVariant;

      const dragHandle = Platform.OS === "web" ? (
        <div
          {...(dragHandleProps ?? {})}
          style={{
            width: 32,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <Icon source="drag" size={20} color={dragIconColor} />
        </div>
      ) : (
        <AnimatedPressable
          borderless={false}
          rippleColor="rgba(0, 0, 0, .12)"
          onPressIn={onDragStart}
          style={styles.dragHandle}
        >
          <Icon source="drag" size={20} color={dragIconColor} />
        </AnimatedPressable>
      );

      return (
        <View
          style={[
            styles.item,
            {
              backgroundColor: theme.colors.background,
              boxShadow: theme.colors.shadow,
              borderColor: darkmode ? theme.colors.outlineVariant : "white",
              borderWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          {dragHandle}
          <View
            style={{
              width: StyleSheet.hairlineWidth,
              height: "100%",
              backgroundColor: darkmode
                ? theme.colors.outlineVariant
                : theme.colors.outline,
              opacity: darkmode ? 1 : 0.28,
            }}
          />
          <View style={styles.content}>
            <Icon source={icon} size={20} color={theme.colors.primary} />
            <Text
              variant="bodyMedium"
              numberOfLines={1}
              style={{ flex: 1, userSelect: "none" }}
            >
              {label}
            </Text>
            <Text
              variant="labelSmall"
              style={{ opacity: 0.55, userSelect: "none" }}
            >
              {index + 1}
            </Text>
          </View>
        </View>
      );
    },
    [darkmode, t, theme.colors],
  );

  const webList = useMemo(() => {
    if (Platform.OS !== "web") return null;

    const { DragDropContext, Droppable, Draggable } = require("@hello-pangea/dnd");

    return (
      <DragDropContext
        onDragEnd={(result: any) => {
          if (!result.destination) return;
          if (result.source.index === result.destination.index) return;
          setItems((current) =>
            moveModule(current, result.source.index, result.destination.index),
          );
        }}
      >
        <Droppable droppableId="edit-modules-reorder-screen">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                flex: 1,
                width: "100%",
                overflow: "auto",
                paddingTop: 4,
                paddingRight: 0,
              }}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided: any) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      style={{
                        userSelect: "none",
                        position: "static",
                        top: "auto",
                        left: "auto",
                        ...draggableProvided.draggableProps.style,
                      }}
                    >
                      {renderModuleItem(
                        item,
                        index,
                        undefined,
                        draggableProvided.dragHandleProps,
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }, [items, renderModuleItem]);

  const nativeList = useMemo(() => {
    if (Platform.OS === "web") return null;

    const draggableFlatListModule = require("react-native-draggable-flatlist");
    const DraggableFlatList =
      draggableFlatListModule.default ?? draggableFlatListModule;

    return (
      <DraggableFlatList
        data={items}
        keyExtractor={(item: ModuleType) => item.id}
        activationDistance={8}
        initialNumToRender={16}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={{ paddingTop: 4 }}
        renderItem={({ item, getIndex, drag }: RenderItemParams<ModuleType>) =>
          renderModuleItem(item, getIndex?.() ?? 0, drag)
        }
        onDragEnd={({ data }: { data: ModulesType }) => setItems(data)}
      />
    );
  }, [items, renderModuleItem]);

  const applyChanges = () => {
    route.params.onApply(items);
    navigation.goBack();
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <FocusAwareStatusBar animated={true} style="light" translucent={true} />
      <LinearGradient
        colors={getColors()}
        dither
        style={{
          paddingTop: headerTop,
          paddingHorizontal: 10,
          paddingBottom: TITLEBAR_HEIGHT > 0 ? 4 : 6,
          width: "100%",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 5,
        }}
        end={{ x: 0.1, y: 0.2 }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
            paddingRight: Platform.OS === "web" && TITLEBAR_HEIGHT > 0 ? 104 : 0,
          }}
        >
          <View
            id="module-reorder-header-drag-region"
            style={{
              flex: 1,
              minWidth: 0,
              height: 36,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <VerticalReorderIcon size={20} color="white" />
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{
                color: "white",
                flexShrink: 1,
                fontWeight: "700",
                userSelect: "none",
              }}
            >
              {t("home:reorderChip")}
            </Text>
            <View
              style={{
                height: 24,
                minWidth: 24,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                variant="labelMedium"
                style={{ color: "white", userSelect: "none" }}
              >
                {items.length}
              </Text>
            </View>
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                zIndex: 10,
              },
              webNoDragStyle,
            ]}
          >
            <IconButton
              accessibilityLabel={t("common:cancel")}
              icon="close"
              iconColor="white"
              size={22}
              onPress={() => navigation.goBack()}
              style={[
                { margin: 0, width: 36, height: 36, zIndex: 11 },
                webNoDragStyle,
              ]}
            />
            <IconButton
              accessibilityLabel={t("common:apply")}
              icon="check"
              iconColor="white"
              size={22}
              onPress={applyChanges}
              style={[
                {
                  margin: 0,
                  width: 36,
                  height: 36,
                  zIndex: 11,
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                },
                webNoDragStyle,
              ]}
            />
          </View>
        </View>
      </LinearGradient>
      <View
        style={{
          flex: 1,
          width: "100%",
          paddingLeft: width > 600 ? 0 : 4,
          paddingRight: 0,
        }}
      >
        {Platform.OS === "web" ? webList : nativeList}
      </View>
    </AnimatedContainer>
  );
}
