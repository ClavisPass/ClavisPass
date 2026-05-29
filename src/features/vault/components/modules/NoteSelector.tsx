import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider } from "react-native-paper";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import AdaptiveMenu from "../../../../shared/components/menus/AdaptiveMenu";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";

export type NoteSelectorOption<T extends string> = {
  label: string;
  value: T;
  icon?: string;
};

type Props<T extends string> = {
  value: T;
  options: NoteSelectorOption<T>[];
  onSelect: (value: T) => void;
};

function NoteSelector<T extends string>({
  value,
  options,
  onSelect,
}: Props<T>) {
  const { theme } = useTheme();
  const triggerRef = useRef<View>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  const open = () => {
    const node = triggerRef.current as any;
    if (node?.measureInWindow) {
      node.measureInWindow(
        (x: number, y: number, _width: number, height: number) => {
          setPosition({ x, y: y + height });
          setVisible(true);
        },
      );
      return;
    }

    setVisible(true);
  };

  return (
    <View ref={triggerRef} collapsable={false} style={styles.selectorWrap}>
      <Button
        compact
        mode="contained-tonal"
        icon={selected?.icon}
        textColor={theme.colors.primary}
        onPress={open}
        contentStyle={styles.selectorButtonContent}
        labelStyle={styles.selectorButtonLabel}
        style={styles.selectorButton}
      >
        {selected?.label}
      </Button>
      <AdaptiveMenu
        visible={visible}
        setVisible={setVisible}
        positionY={position.y}
        positionX={position.x}
        offsetY={4}
        items={[]}
        nativeSnapPoints={[Math.min(320, options.length * 44 + 80)]}
        customContent={
          <>
            {options.map((option, index) => (
              <View key={option.value}>
                <MenuItem
                  leadingIcon={option.icon}
                  selected={option.value === value}
                  onPress={() => {
                    onSelect(option.value);
                    setVisible(false);
                  }}
                >
                  {option.label}
                </MenuItem>
                {index < options.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectorWrap: {
    minWidth: 92,
    height: 34,
    justifyContent: "center",
  },
  selectorButton: {
    margin: 0,
    width: "100%",
    borderRadius: 8,
  },
  selectorButtonContent: {
    height: 34,
    minHeight: 34,
    paddingLeft: 2,
    paddingRight: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorButtonLabel: {
    marginLeft: 7,
    marginRight: 1,
    marginVertical: 0,
    fontSize: 12,
    lineHeight: 14,
  },
});

export default NoteSelector;
