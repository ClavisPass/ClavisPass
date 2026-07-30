import React, { ReactNode } from "react";
import {
  View,
  Platform,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import { Divider, Icon } from "react-native-paper";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";
import Animated, { FadeOutUp } from "react-native-reanimated";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import TooltipIconButton from "../../../shared/components/buttons/TooltipIconButton";

export type EditRowControlsContainerProps = {
  id: string;
  children: ReactNode;
  onDragStart?: () => void;
  onDelete?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  topRightInset?: number;
  swipeActionRightInset?: number;
  swipeActionBottomInset?: number;
};

const DRAG_RAIL_WIDTH = 29;
const DELETE_BUTTON_ZONE = 36;
const SWIPE_DELETE_WIDTH = 78;
const SWIPE_DELETE_OVERSCAN = 48;
const WebDragHandlePropsContext = React.createContext<any>(null);

export function WebDragHandlePropsProvider({
  children,
  dragHandleProps,
}: {
  children: ReactNode;
  dragHandleProps?: any;
}) {
  return (
    <WebDragHandlePropsContext.Provider value={dragHandleProps ?? null}>
      {children}
    </WebDragHandlePropsContext.Provider>
  );
}

export function EditRowControlsContainer({
  id,
  children,
  onDragStart,
  onDelete,
  style,
  contentStyle,
  topRightInset = 0,
  swipeActionRightInset = 0,
  swipeActionBottomInset = 0,
}: EditRowControlsContainerProps) {
  const { t } = useTranslation();
  const { theme, darkmode } = useTheme();
  const webDragHandleProps = React.useContext(WebDragHandlePropsContext);
  const swipeableRef = React.useRef<SwipeableMethods | null>(null);
  const [dragHovered, setDragHovered] = React.useState(false);
  const [dragPressed, setDragPressed] = React.useState(false);
  const showDragHandle = Boolean(onDragStart) || Boolean(webDragHandleProps);
  const canSwipeDelete = Platform.OS !== "web" && Boolean(onDelete);
  const dragHandleContent = (
    <AnimatedPressable
      borderless={false}
      style={[
        {
          height: "100%",
          width: DRAG_RAIL_WIDTH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        Platform.OS === "web" ? ({ pointerEvents: "none" } as any) : null,
        dragHovered
          ? {
              backgroundColor: darkmode
                ? "rgba(255, 255, 255, .04)"
                : "rgba(0, 0, 0, .035)",
            }
          : null,
        dragPressed
          ? {
              backgroundColor: darkmode
                ? "rgba(255, 255, 255, .08)"
                : "rgba(0, 0, 0, .07)",
            }
          : null,
      ]}
      onPressIn={Platform.OS === "web" ? undefined : onDragStart}
    >
      <Icon
        source="drag"
        size={20}
        color={darkmode ? theme.colors?.outline : theme.colors?.outlineVariant}
      />
    </AnimatedPressable>
  );

  const renderDeleteSwipeAction = () => (
    <View
      style={{
        width: SWIPE_DELETE_WIDTH + swipeActionRightInset,
        marginBottom: swipeActionBottomInset,
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: -SWIPE_DELETE_OVERSCAN,
          right: swipeActionRightInset + 1,
          top: 1,
          bottom: 1,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          overflow: "hidden",
          backgroundColor: theme.colors.error,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon source="trash-can" size={22} color={theme.colors.onError} />
      </View>
    </View>
  );

  const content = (
    <Animated.View
      exiting={FadeOutUp.duration(150)}
      style={[
        {
          flexDirection: "row",
          flex: 1,
          backgroundColor: theme.colors.background,
          borderRadius: 12,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          borderWidth: StyleSheet.hairlineWidth,
          overflow: "hidden",
          position: "relative",
        },
        style,
      ]}
    >
      {showDragHandle ? (
        <View
          style={{
            width: DRAG_RAIL_WIDTH,
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {Platform.OS === "web" ? (
            <div
              {...(webDragHandleProps ?? {})}
              onMouseEnter={(event) => {
                setDragHovered(true);
                webDragHandleProps?.onMouseEnter?.(event);
              }}
              onMouseLeave={(event) => {
                setDragHovered(false);
                setDragPressed(false);
                webDragHandleProps?.onMouseLeave?.(event);
              }}
              onMouseDown={(event) => {
                setDragPressed(true);
                webDragHandleProps?.onMouseDown?.(event);
              }}
              onMouseUp={(event) => {
                setDragPressed(false);
                webDragHandleProps?.onMouseUp?.(event);
              }}
              onTouchStart={(event) => {
                setDragPressed(true);
                webDragHandleProps?.onTouchStart?.(event);
              }}
              onTouchEnd={(event) => {
                setDragPressed(false);
                webDragHandleProps?.onTouchEnd?.(event);
              }}
              style={{
                width: DRAG_RAIL_WIDTH,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
                touchAction: "none",
                userSelect: "none",
              }}
            >
              {dragHandleContent}
            </div>
          ) : (
            dragHandleContent
          )}
          <Divider
            style={{
              width: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
              height: "100%",
            }}
          />
        </View>
      ) : null}

      <View style={[{ flex: 1, paddingRight: topRightInset }, contentStyle]}>
        {children}
      </View>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 6,
          right: 1,
          width: DELETE_BUTTON_ZONE,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <TooltipIconButton
          tooltip={t("common:removeModule")}
          style={{ margin: 0, width: 24, height: 24 }}
          selected
          mode="contained-tonal"
          icon="close"
          size={12}
          onPress={() => onDelete?.(id)}
          tabIndex={-1 as any}
        />
      </View>
    </Animated.View>
  );

  if (!canSwipeDelete) return content;

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={52}
      dragOffsetFromRightEdge={24}
      overshootRight={false}
      renderRightActions={renderDeleteSwipeAction}
      onSwipeableOpen={() => {
        swipeableRef.current?.close();
        onDelete?.(id);
      }}
    >
      {content}
    </ReanimatedSwipeable>
  );
}
