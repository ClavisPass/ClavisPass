import React, { useCallback, useMemo, useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import { Icon, IconButton, Text } from "react-native-paper";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";

import { useTheme } from "../app/providers/ThemeProvider";
import { useVault } from "../app/providers/VaultProvider";
import { HomeStackParamList } from "../app/navigation/model/types";
import ValuesType from "../features/vault/model/ValuesType";
import ListItem from "../features/vault/components/items/ListItem";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "../shared/components/titlebarMetrics";
import getColors from "../shared/ui/linearGradient";
import { isMacWebRuntime } from "../infrastructure/platform/isTauri";

type ReorderScreenProps = NativeStackScreenProps<HomeStackParamList, "Reorder">;

const noop = () => {};
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

function moveEntryAfterPreviousVisibleId(
  values: ValuesType[],
  movedId: string,
  previousVisibleId: string | null,
) {
  if (movedId === previousVisibleId) return values;

  const moved = values.find((entry) => entry.id === movedId);
  if (!moved) return values;

  const valuesWithoutMoved = values.filter((entry) => entry.id !== movedId);
  if (!previousVisibleId) return [moved, ...valuesWithoutMoved];

  const previousIndex = valuesWithoutMoved.findIndex(
    (entry) => entry.id === previousVisibleId,
  );
  if (previousIndex < 0) return values;

  return [
    ...valuesWithoutMoved.slice(0, previousIndex + 1),
    moved,
    ...valuesWithoutMoved.slice(previousIndex + 1),
  ];
}

function applyVisibleOrder(values: ValuesType[], orderedVisible: ValuesType[]) {
  let next = values;

  orderedVisible.forEach((entry, index) => {
    const previousVisibleId =
      index <= 0 ? null : (orderedVisible[index - 1]?.id ?? null);
    next = moveEntryAfterPreviousVisibleId(next, entry.id, previousVisibleId);
  });

  return next;
}

export default function ReorderScreen({ route, navigation }: ReorderScreenProps) {
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
  const vault = useVault();
  const [items, setItems] = useState<ValuesType[]>(route.params.values ?? []);

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
      .getElementById("reorder-header-drag-region")
      ?.setAttribute("data-tauri-drag-region", "");
  }, []);

  const renderReorderItem = useCallback(
    (
      item: ValuesType,
      index: number,
      onDragStart?: () => void,
      dragHandleProps?: any,
    ) => (
      <ListItem
        item={item}
        index={index}
        reorderMode
        disableFastAccessPreview
        hideChevron
        pressDisabled
        onDragStart={onDragStart}
        dragHandleProps={dragHandleProps}
        onPress={noop}
      />
    ),
    [],
  );

  const webList = useMemo(() => {
    if (Platform.OS !== "web") return null;

    const { DragDropContext, Droppable, Draggable } = require("@hello-pangea/dnd");

    return (
      <DragDropContext
        onDragEnd={(result: any) => {
          if (!result.destination) return;
          if (result.source.index === result.destination.index) return;

          setItems((current) => {
            const next = [...current];
            const [removed] = next.splice(result.source.index, 1);
            if (!removed) return current;
            next.splice(result.destination.index, 0, removed);
            return next;
          });
        }}
      >
        <Droppable droppableId="home-values-reorder-screen">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                flex: 1,
                width: "100%",
                overflow: "auto",
                paddingRight: 4,
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
                        marginBottom: 4,
                      }}
                    >
                      {renderReorderItem(
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
  }, [items, renderReorderItem]);

  const nativeList = useMemo(() => {
    if (Platform.OS === "web") return null;

    const draggableFlatListModule = require("react-native-draggable-flatlist");
    const DraggableFlatList =
      draggableFlatListModule.default ?? draggableFlatListModule;

    return (
      <DraggableFlatList
        data={items}
        keyExtractor={(item: ValuesType) => item.id}
        activationDistance={8}
        initialNumToRender={16}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
        renderItem={({ item, getIndex, drag }: RenderItemParams<ValuesType>) =>
          renderReorderItem(item, getIndex?.() ?? 0, drag)
        }
        onDragEnd={({ data }: { data: ValuesType[] }) => setItems(data)}
      />
    );
  }, [items, renderReorderItem]);

  const applyChanges = () => {
    vault.update((draft) => {
      draft.values = applyVisibleOrder(draft.values ?? [], items);
    });
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
              isMacWebRuntime()
                ? TITLEBAR_CONTROLS_WIDTH
                : 0,
            paddingRight:
              Platform.OS === "web" &&
              TITLEBAR_HEIGHT > 0 &&
              !isMacWebRuntime()
                ? 104
                : 0,
          }}
        >
          <View
            id="reorder-header-drag-region"
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
          padding: 4,
          paddingLeft: width > 600 ? 0 : 4,
          paddingRight: 0,
        }}
      >
        {Platform.OS === "web" ? webList : nativeList}
      </View>
    </AnimatedContainer>
  );
}
