import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { View, Platform, useWindowDimensions, StyleSheet } from "react-native";
import { Divider, Text } from "react-native-paper";
import type { Option as DropdownOption } from "react-native-paper-dropdown";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { MenuItem } from "../../../shared/components/menus/MenuItem";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import SettingsDivider from "./SettingsDivider";

// Native (iOS/Android)
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

// Web (Radix)
import * as Popover from "@radix-ui/react-popover";

type Props = {
  value: string;
  setValue: (value: string) => void;
  options: DropdownOption[];
  label?: string;
  leadingIcon?: string;

  // Web sizing
  dropdownMaxWidth?: number;
  dropdownMinWidth?: number;
  yOffset?: number;

  // Native sizing
  nativeSnapPoints?: (string | number)[];
};

const ITEM_HEIGHT = 44;

export default function SettingsDropdownItem({
  value,
  setValue,
  options,
  label,
  leadingIcon,
  dropdownMaxWidth = 260,
  dropdownMinWidth = 200,
  yOffset = 6,
  nativeSnapPoints,
}: Props) {
  const { theme } = useTheme();
  const { height: winH } = useWindowDimensions();

  const selectedLabel = useMemo(
    () => options.find((o) => String(o.value) === String(value))?.label ?? "",
    [options, value]
  );

  /**
   * iOS/Android: BottomSheet (unchanged)
   */
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo<(string | number)[]>(() => {
    if (nativeSnapPoints?.length) return nativeSnapPoints;

    const desired = ITEM_HEIGHT * options.length + 80; // padding/divider
    const max = Math.min(winH * 0.7, 520);
    return [Math.min(desired, max)];
  }, [nativeSnapPoints, options.length, winH]);

  const openNativeSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const closeNativeSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  /**
   * Web: Radix Popover
   */
  const [openWeb, setOpenWeb] = useState(false);

  const portalContainer = useMemo(() => {
    if (Platform.OS !== "web") return null;
    return document.getElementById("dropdown-layer") ?? null;
  }, []);

  // Close on resize/scroll (dropdown-like behavior)
  useEffect(() => {
    if (Platform.OS !== "web" || !openWeb) return;

    const close = () => setOpenWeb(false);

    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("resize", close);
    };
  }, [openWeb]);

  /**
   * Trigger handler
   */
  const onPressTrigger = () => {
    if (Platform.OS === "web") setOpenWeb((v) => !v);
    else openNativeSheet();
  };

  /**
   * Shared trigger UI
   */
  const TriggerUI = (
    <View collapsable={false}>
      <AnimatedPressable onPress={onPressTrigger}>
        <MenuItem leadingIcon={leadingIcon} rightText={String(selectedLabel)}>
          {label}
        </MenuItem>
      </AnimatedPressable>
    </View>
  );

  /**
   * WEB
   *
   * Key change for sizing:
   * - remove fixed `width`
   * - make minWidth follow trigger width (native dropdown feel)
   * - cap with maxWidth
   */
  if (Platform.OS === "web") {
    return (
      <Popover.Root open={openWeb} onOpenChange={setOpenWeb}>
        <Popover.Trigger asChild>{TriggerUI}</Popover.Trigger>

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

    // outer shell only
    maxHeight: "min(var(--radix-popover-content-available-height), 520px)",
    overflow: "hidden",

    borderRadius: 12,
    background: theme.colors.background as any,
    border: `${StyleSheet.hairlineWidth}px solid ${theme.colors.outlineVariant}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  }}
>
  {/* Web: use a real div for scroll reliability */}
  <div
    style={{
      maxHeight: "min(var(--radix-popover-content-available-height), 520px)",
      overflowY: "auto",
      overscrollBehavior: "contain",
      WebkitOverflowScrolling: "touch",
    }}
  >
    {options.map((opt, i) => (
      <div key={String(opt.value)}>
        <AnimatedPressable
          onPress={() => {
            setValue(String(opt.value));
            setOpenWeb(false);
          }}
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
              fontSize: 14,
              lineHeight: 18,
              textAlign: "right",
              ...(Platform.OS === "web"
                ? ({ whiteSpace: "nowrap" } as any)
                : null),
            }}
          >
            {String(opt.label)}
          </Text>
        </AnimatedPressable>

        {i < options.length - 1 && (
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        )}
      </div>
    ))}
  </div>
</Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  /**
   * NATIVE (unchanged)
   */
  return (
    <View>
      {TriggerUI}

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
          <SettingsDivider />
          {options.map((opt, i) => (
            <View key={String(opt.value)}>
              <AnimatedPressable
                onPress={() => {
                  setValue(String(opt.value));
                  closeNativeSheet();
                }}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  paddingHorizontal: 16,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    fontSize: 16,
                    lineHeight: 20,
                  }}
                >
                  {String(opt.label)}
                </Text>
              </AnimatedPressable>

              {i < options.length - 1 ? (
                <Divider
                  style={{ backgroundColor: theme.colors.outlineVariant }}
                />
              ) : null}
            </View>
          ))}
          <SettingsDivider />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
