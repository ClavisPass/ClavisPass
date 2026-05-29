import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Divider } from "react-native-paper";

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
      <Chip
        mode="flat"
        icon={selected?.icon}
        onPress={open}
        style={styles.selectorChip}
      >
        {selected?.label}
      </Chip>
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
    justifyContent: "center",
  },
  selectorChip: {
    margin: 0,
    borderRadius: 12,
  },
});

export default NoteSelector;
