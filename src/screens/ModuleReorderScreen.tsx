import React, { useCallback, useMemo, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../app/providers/ThemeProvider";
import { HomeStackParamList } from "../app/navigation/model/types";
import ModulesType, { ModuleType } from "../features/vault/model/ModulesType";
import {
  NativeDragHandleScrollLockProvider,
  WebDragHandlePropsProvider,
} from "../features/vault/components/EditRowControlsContainer";
import getModule from "../features/vault/utils/getModule";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import { getScreenContentStyle } from "../shared/ui/glass";

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
const dragDropAnimationConfig = {
  damping: 32,
  mass: 0.12,
  overshootClamping: true,
  restDisplacementThreshold: 1,
  restSpeedThreshold: 1,
  stiffness: 420,
};
const webNoDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "no-drag",
        appRegion: "no-drag",
      } as any)
    : null;

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
    globalStyles,
    setHeaderSpacing,
    setHeaderWhite,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const screenContentStyle = getScreenContentStyle(theme);
  const [items, setItems] = useState<ModulesType>(route.params.modules);
  const ignoreModuleChange = useCallback(() => {}, []);
  const [nativeScrollEnabled, setNativeScrollEnabled] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);
    }, [
      setHeaderSpacing,
      setHeaderWhite,
      setTitlebarCenterGap,
      setTitlebarOverlayDragEnabled,
    ]),
  );

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
        false,
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
      <NativeDragHandleScrollLockProvider
        onPendingStart={() => setNativeScrollEnabled(false)}
        onPendingEnd={() => setNativeScrollEnabled(true)}
      >
        <DraggableFlatList
          data={items}
          keyExtractor={(item: ModuleType) => item.id}
          activationDistance={0}
          animationConfig={dragDropAnimationConfig}
          scrollEnabled={nativeScrollEnabled}
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
      </NativeDragHandleScrollLockProvider>
    );
  }, [items, nativeScrollEnabled, renderModuleItem]);

  const applyChanges = () => {
    route.params.onApply(items);
    requestAnimationFrame(() => navigation.goBack());
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <Header
        title={t("home:reorderChip")}
        onPress={() => navigation.goBack()}
      >
        <View
          style={{
            height: 24,
            minWidth: 24,
            paddingHorizontal: 8,
            borderRadius: 12,
            backgroundColor: `${theme.colors.primary}18`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.primary, userSelect: "none" }}
          >
            {items.length}
          </Text>
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
            accessibilityLabel={t("common:apply")}
            mode="contained-tonal"
            compact
            textColor={theme.colors.primary}
            onPress={applyChanges}
            style={[
              {
                margin: 0,
                zIndex: 11,
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
      </Header>
      <View
        style={{
          ...screenContentStyle,
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
