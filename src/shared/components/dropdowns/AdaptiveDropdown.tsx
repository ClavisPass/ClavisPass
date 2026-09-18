import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Divider, Text } from "react-native-paper";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import * as Popover from "@radix-ui/react-popover";

import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";

export type AdaptiveDropdownOption = {
  label: string;
  value: string;
};

type RenderTriggerParams = {
  selectedLabel: string;
  open: () => void;
  value: string;
};

type Props = {
  value: string;
  setValue: (value: string) => boolean | void;
  options: AdaptiveDropdownOption[];
  renderTrigger: (params: RenderTriggerParams) => React.ReactNode;
  dropdownMaxWidth?: number;
  dropdownMinWidth?: number;
  yOffset?: number;
  nativeSnapPoints?: (string | number)[];
  itemTextAlign?: "left" | "right" | "center";
  itemFontSize?: number;
};

const ITEM_HEIGHT = 44;

export default function AdaptiveDropdown({
  value,
  setValue,
  options,
  renderTrigger,
  dropdownMaxWidth = 260,
  dropdownMinWidth = 200,
  yOffset = 6,
  nativeSnapPoints,
  itemTextAlign = "left",
  itemFontSize,
}: Props) {
  const { theme } = useTheme();
  const { height: winH } = useWindowDimensions();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [openWeb, setOpenWeb] = useState(false);

  const selectedLabel = useMemo(
    () =>
      options.find((option) => String(option.value) === String(value))?.label ??
      "",
    [options, value],
  );

  const snapPoints = useMemo<(string | number)[]>(() => {
    if (nativeSnapPoints?.length) return nativeSnapPoints;

    const desired = ITEM_HEIGHT * options.length + 80;
    const max = Math.min(winH * 0.7, 520);
    return [Math.min(desired, max)];
  }, [nativeSnapPoints, options.length, winH]);

  const portalContainer = useMemo(() => {
    if (Platform.OS !== "web") return null;
    return document.getElementById("dropdown-layer") ?? null;
  }, []);

  const closeNativeSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const open = useCallback(() => {
    Keyboard.dismiss();

    if (Platform.OS === "web") {
      setOpenWeb(true);
      return;
    }

    bottomSheetModalRef.current?.present();
  }, []);

  const selectValue = useCallback(
    (nextValue: string) => {
      const shouldClose = setValue(nextValue);
      if (shouldClose === false) return;
      if (Platform.OS === "web") setOpenWeb(false);
      else closeNativeSheet();
    },
    [closeNativeSheet, setValue],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    if (Platform.OS !== "web" || !openWeb) return;

    const close = () => setOpenWeb(false);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("resize", close);
    };
  }, [openWeb]);

  const trigger = (
    <View collapsable={false}>
      {renderTrigger({ selectedLabel, open, value })}
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <Popover.Root open={openWeb} onOpenChange={setOpenWeb}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal container={portalContainer as any}>
          <Popover.Content
            side="bottom"
            align="end"
            sideOffset={yOffset}
            collisionPadding={8}
            style={{
              pointerEvents: "auto",
              zIndex: 10001,
              minWidth: `max(${dropdownMinWidth}px, var(--radix-popover-trigger-width))`,
              maxWidth: dropdownMaxWidth,
              maxHeight:
                "min(var(--radix-popover-content-available-height), 520px)",
              overflow: "hidden",
              borderRadius: 12,
              background: theme.colors.background as any,
              border: `${StyleSheet.hairlineWidth}px solid ${theme.colors.outlineVariant}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                maxHeight:
                  "min(var(--radix-popover-content-available-height), 520px)",
                overflowY: "auto",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {options.map((option, index) => (
                <div key={String(option.value)}>
                  <AnimatedPressable
                    onPress={() => selectValue(String(option.value))}
                    style={{
                      height: ITEM_HEIGHT,
                      justifyContent: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      selectable={false}
                      style={{
                        color: theme.colors.onSurface,
                        fontSize: itemFontSize ?? 14,
                        lineHeight: 18,
                        textAlign: itemTextAlign,
                        ...(Platform.OS === "web"
                          ? ({ whiteSpace: "nowrap" } as any)
                          : null),
                      }}
                    >
                      {String(option.label)}
                    </Text>
                  </AnimatedPressable>
                  {index < options.length - 1 ? (
                    <Divider
                      style={{ backgroundColor: theme.colors.outlineVariant }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <View>
      {trigger}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        enableDismissOnClose
        stackBehavior="replace"
        backdropComponent={renderBackdrop}
        style={{
          borderColor: theme.colors.outlineVariant,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderRadius: 0,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 0,
        }}
      >
        <BottomSheetView style={{ paddingBottom: 60 }}>
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
          {options.map((option, index) => (
            <View key={String(option.value)}>
              <AnimatedPressable
                onPress={() => selectValue(String(option.value))}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  paddingHorizontal: 16,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    fontSize: itemFontSize ?? 16,
                    lineHeight: 20,
                    textAlign: itemTextAlign,
                  }}
                >
                  {String(option.label)}
                </Text>
              </AnimatedPressable>
              {index < options.length - 1 ? (
                <Divider
                  style={{ backgroundColor: theme.colors.outlineVariant }}
                />
              ) : null}
            </View>
          ))}
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
