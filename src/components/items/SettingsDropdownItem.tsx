import { useMemo, useRef, useState } from "react";
import {
  View,
  Pressable,
  LayoutChangeEvent,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { Surface, Text, Divider } from "react-native-paper";
import type { Option as DropdownOption } from "react-native-paper-dropdown";
import { useTheme } from "../../contexts/ThemeProvider";
import { MenuItem } from "./MenuItem";
import AnimatedPressable from "../AnimatedPressable";

type Props = {
  value: string;
  setValue: (value: string) => void;
  options: DropdownOption[];
  label?: string;
  leadingIcon?: string;
  dropdownMaxWidth?: number;
  dropdownMinWidth?: number;
  yOffset?: number;
};

const ITEM_HEIGHT = 44;

export default function SettingsDropdownItem({
  value,
  setValue,
  options,
  label,
  leadingIcon,
  dropdownMaxWidth = 100,
  dropdownMinWidth = 100,
  yOffset = 6,
}: Props) {
  const { theme } = useTheme();
  const { width: winW, height: winH } = useWindowDimensions();

  const [open, setOpen] = useState(false);

  const [anchor, setAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const triggerRef = useRef<View>(null);

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value]
  );

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  };

  const plannedWidth = dropdownMaxWidth;

  let left = anchor.x + anchor.w - plannedWidth;
  const top = anchor.y + anchor.h + yOffset;

  if (left < 8) left = 8;
  const maxLeft = Math.max(8, winW - dropdownMinWidth - 8);
  if (left > maxLeft) left = maxLeft;

  const maxListHeight = Math.min(
    winH * 0.5,
    Math.max(ITEM_HEIGHT * 5, ITEM_HEIGHT * options.length)
  );

  return (
    <View style={{ overflow: "visible" }}>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        onLayout={(_e: LayoutChangeEvent) => {}}
        accessibilityRole="button"
      >
        <MenuItem leadingIcon={leadingIcon} rightText={selectedLabel}>
          {label}
        </MenuItem>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={{ flex: 1, backgroundColor: "transparent" }} />
        </TouchableWithoutFeedback>
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top,
            left,
            width: plannedWidth,
          }}
        >
          <Surface
            elevation={3}
            style={{
              borderRadius: 12,
              backgroundColor: theme.colors.background,
              minWidth: dropdownMinWidth,
              maxWidth: dropdownMaxWidth,
              maxHeight: maxListHeight,
              overflow: "hidden",
            }}
          >
            <View>
              {options.map((opt, i) => (
                <View key={String(opt.value)}>
                  <AnimatedPressable
                    onPress={() => {
                      setValue(String(opt.value));
                      setOpen(false);
                    }}
                    style={{
                      height: ITEM_HEIGHT,
                      justifyContent: "center",
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      selectable={false}
                      style={{
                        textAlign: "right",
                        textAlignVertical: "center",
                        color: theme.colors.onSurface,
                        fontSize: 14,
                        lineHeight: 18,
                      }}
                    >
                      {String(opt.label)}
                    </Text>
                  </AnimatedPressable>

                  {i < options.length - 1 && (
                    <Divider
                      style={{
                        backgroundColor: theme.colors.outlineVariant,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
