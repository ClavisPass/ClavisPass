import React from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { Divider } from "react-native-paper";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

import { useTheme } from "../../../app/providers/ThemeProvider";
import Menu from "./Menu";
import { MenuItem } from "./MenuItem";

const ITEM_HEIGHT = 44;

export type AdaptiveMenuItem = {
  key: string;
  label: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  withDivider?: boolean;
};

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  positionY: number;
  items: AdaptiveMenuItem[];
  topContent?: React.ReactNode;
  nativeSnapPoints?: (string | number)[];
};

function AdaptiveMenu(props: Props) {
  const { theme } = useTheme();
  const { height: winH } = useWindowDimensions();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const close = React.useCallback(() => {
    props.setVisible(false);
  }, [props]);

  const closeSheet = React.useCallback(() => {
    close();
    bottomSheetModalRef.current?.dismiss();
  }, [close]);

  const enabledItems = React.useMemo(
    () => props.items.filter((item) => !item.disabled).length,
    [props.items]
  );

  const snapPoints = React.useMemo<(string | number)[]>(() => {
    if (props.nativeSnapPoints?.length) return props.nativeSnapPoints;

    const topContentHeight = props.topContent ? 72 : 0;
    const desired = topContentHeight + ITEM_HEIGHT * Math.max(props.items.length, 1) + 80;
    const max = Math.min(winH * 0.7, 520);
    return [Math.min(desired, max)];
  }, [props.items.length, props.nativeSnapPoints, props.topContent, winH]);

  const renderBackdrop = React.useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  React.useEffect(() => {
    if (Platform.OS === "web") return;

    if (props.visible) bottomSheetModalRef.current?.present();
    else bottomSheetModalRef.current?.dismiss();
  }, [props.visible]);

  if (Platform.OS === "web") {
    return (
      <Menu
        visible={props.visible}
        onDismiss={close}
        positionY={props.positionY}
      >
        <>
          {props.topContent}
          {props.topContent ? <Divider /> : null}
          {props.items.map((item, index) => (
            <View key={item.key}>
              <MenuItem
                leadingIcon={item.icon}
                onPress={
                  item.disabled
                    ? undefined
                    : () => {
                        item.onPress();
                        close();
                      }
                }
              >
                {item.label}
              </MenuItem>
              {(item.withDivider ?? index < props.items.length - 1) ? <Divider /> : null}
            </View>
          ))}
        </>
      </Menu>
    );
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableDismissOnClose
      stackBehavior="replace"
      backdropComponent={renderBackdrop}
      onDismiss={() => {
        if (props.visible) close();
      }}
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
        {props.topContent}
        {props.topContent ? (
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        ) : null}
        {props.items.map((item, index) => (
          <View key={item.key}>
            <MenuItem
              leadingIcon={item.icon}
              onPress={
                item.disabled
                  ? undefined
                  : () => {
                      item.onPress();
                      closeSheet();
                    }
              }
            >
              {item.label}
            </MenuItem>
            {(item.withDivider ?? index < props.items.length - 1) ? (
              <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
            ) : null}
          </View>
        ))}
        {enabledItems > 0 ? (
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default AdaptiveMenu;
