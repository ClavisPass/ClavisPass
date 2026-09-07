import React, { useCallback, useMemo, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import { Button, Icon, Text } from "react-native-paper";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import { useTranslation } from "react-i18next";

import { useTheme } from "../app/providers/ThemeProvider";
import { HomeStackParamList } from "../app/navigation/model/types";
import ModulesType, { ModuleType } from "../features/vault/model/ModulesType";
import { WebDragHandlePropsProvider } from "../features/vault/components/EditRowControlsContainer";
import getModule from "../features/vault/utils/getModule";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "../shared/components/titlebarMetrics";
import getColors from "../shared/ui/linearGradient";
import { useSetting } from "../app/providers/SettingsProvider";
import { resolveWindowControlsSide } from "../infrastructure/platform/windowControls";

type ModuleReorderScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "ModuleReorder"
>;

const styles = StyleSheet.create({
  readOnlyOverlay: {
    ...StyleSheet.absoluteFillObject,
    left: 29,
    backgroundColor: "transparent",
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
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";
  const [items, setItems] = useState<ModulesType>(route.params.modules);
  const ignoreModuleChange = useCallback(() => {}, []);

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
      onDragStart?: () => void,
      dragHandleProps?: any,
    ) => {
      const moduleNode = getModule(
        item,
        onDragStart,
        undefined,
        ignoreModuleChange,
        null,
        navigation as any,
        "",
      );

      const content = (
        <View style={{ position: "relative", width: "100%" }}>
          {moduleNode}
          <View pointerEvents="auto" style={styles.readOnlyOverlay} />
        </View>
      );

      if (Platform.OS !== "web") return content;

      return (
        <WebDragHandlePropsProvider dragHandleProps={dragHandleProps}>
          {content}
        </WebDragHandlePropsProvider>
      );
    },
    [ignoreModuleChange, navigation],
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
        renderItem={({ item, drag }: RenderItemParams<ModuleType>) =>
          renderModuleItem(item, drag)
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
            paddingLeft:
              Platform.OS === "web" &&
              TITLEBAR_HEIGHT > 0 &&
              width < 600 &&
              controlsLeft
                ? TITLEBAR_CONTROLS_WIDTH
                : 0,
            paddingRight:
              Platform.OS === "web" &&
              TITLEBAR_HEIGHT > 0 &&
              !controlsLeft
                ? 104
                : 0,
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
                gap: 6,
                zIndex: 10,
              },
              webNoDragStyle,
            ]}
          >
            <Button
              accessibilityLabel={t("common:cancel")}
              mode="text"
              compact
              textColor="white"
              onPress={() => navigation.goBack()}
              style={[
                {
                  margin: 0,
                  borderRadius: 12,
                  zIndex: 11,
                  cursor: "pointer",
                } as any,
                webNoDragStyle,
              ]}
              labelStyle={{ marginHorizontal: 8, marginVertical: 4 }}
            >
              {t("common:cancel")}
            </Button>
            <Button
              accessibilityLabel={t("common:apply")}
              mode="contained-tonal"
              compact
              textColor="white"
              onPress={applyChanges}
              style={[
                {
                  margin: 0,
                  zIndex: 11,
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  borderRadius: 12,
                  cursor: "pointer",
                } as any,
                webNoDragStyle,
              ]}
              labelStyle={{ marginHorizontal: 10, marginVertical: 4 }}
            >
              {t("common:save")}
            </Button>
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
