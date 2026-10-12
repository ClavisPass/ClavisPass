import React, { useCallback, useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../app/providers/ThemeProvider";
import { useVault } from "../app/providers/VaultProvider";
import { HomeStackParamList } from "../app/navigation/model/types";
import ValuesType from "../features/vault/model/ValuesType";
import ListItem from "../features/vault/components/items/ListItem";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import {
  SCROLLBAR_CONTENT_GAP,
  getScreenContentStyle,
} from "../shared/ui/glass";

type ReorderScreenProps = NativeStackScreenProps<HomeStackParamList, "Reorder">;

const noop = () => {};
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
    darkmode,
    globalStyles,
    setHeaderSpacing,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const { t } = useTranslation();
  const screenContentStyle = getScreenContentStyle(theme);
  const vault = useVault();
  const [items, setItems] = useState<ValuesType[]>(route.params.values ?? []);
  const [nativeScrollEnabled, setNativeScrollEnabled] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);
    }, [
      setHeaderSpacing,
      setTitlebarCenterGap,
      setTitlebarOverlayDragEnabled,
    ]),
  );

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
        denseSpacing
        denseHorizontalInset={0}
        disableFastAccessPreview
        hideChevron
        pressDisabled
        onDragStart={onDragStart}
        onDragHandlePressIn={() => setNativeScrollEnabled(false)}
        onDragHandleRelease={() => setNativeScrollEnabled(true)}
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
                paddingRight: SCROLLBAR_CONTENT_GAP,
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
        activationDistance={0}
        animationConfig={dragDropAnimationConfig}
        scrollEnabled={nativeScrollEnabled}
        initialNumToRender={16}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={{ paddingRight: SCROLLBAR_CONTENT_GAP }}
        renderItem={({ item, getIndex, drag }: RenderItemParams<ValuesType>) =>
          renderReorderItem(item, getIndex?.() ?? 0, drag)
        }
        onDragEnd={({ data }: { data: ValuesType[] }) => setItems(data)}
      />
    );
  }, [items, nativeScrollEnabled, renderReorderItem]);

  const applyChanges = () => {
    vault.update((draft) => {
      draft.values = applyVisibleOrder(draft.values ?? [], items);
    });
    requestAnimationFrame(() => navigation.goBack());
  };
  const headerButtonBaseStyle = {
    margin: 0,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkmode
      ? "rgba(120, 127, 246, 0.28)"
      : "rgba(120, 127, 246, 0.24)",
    cursor: "pointer",
  } as any;
  const headerButtonLabelStyle = {
    marginHorizontal: 10,
    marginVertical: 4,
    fontSize: 12,
    lineHeight: 16,
  };

  const countBadge = (
    <View
      style={{
        height: 24,
        minWidth: 24,
        marginLeft: 8,
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
  );

  return (
    <AnimatedContainer style={globalStyles.container}>
      <Header
        title={t("home:reorderChip")}
        onPress={() => navigation.goBack()}
        leftNode={countBadge}
      >
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
            mode="contained-tonal"
            compact
            textColor={theme.colors.onSurfaceVariant}
            buttonColor={
              darkmode
                ? "rgba(255, 255, 255, 0.06)"
                : "rgba(248, 248, 248, 0.68)"
            }
            onPress={() => navigation.goBack()}
            style={[headerButtonBaseStyle, webNoDragStyle]}
            labelStyle={headerButtonLabelStyle}
          >
            {t("common:cancel")}
          </Button>
          <Button
            accessibilityLabel={t("common:apply")}
            mode="contained-tonal"
            compact
            textColor={theme.colors.primary}
            buttonColor={
              darkmode
                ? "rgba(120, 127, 246, 0.16)"
                : "rgba(120, 127, 246, 0.12)"
            }
            onPress={applyChanges}
            style={[
              headerButtonBaseStyle,
              {
                zIndex: 11,
              } as any,
              webNoDragStyle,
            ]}
            labelStyle={headerButtonLabelStyle}
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
        }}
      >
        {Platform.OS === "web" ? webList : nativeList}
      </View>
    </AnimatedContainer>
  );
}
