import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Platform, useWindowDimensions } from "react-native";
import { Button, Divider, Icon, IconButton, Text } from "react-native-paper";
import ValuesType from "../../model/ValuesType";
import ModulesEnum from "../../model/ModulesEnum";

import { Image } from "expo-image";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

import extractFastAccessObject from "../../../fastaccess/utils/extractFastAccessObject";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { emitClipboardCopied } from "../../../../infrastructure/events/clipboardBus";
import { useClipboardCopy } from "../../../../shared/hooks/useClipboardCopy";
import AdaptiveMenu, {
  AdaptiveMenuItem,
} from "../../../../shared/components/menus/AdaptiveMenu";
import DeleteModal from "../modals/DeleteModal";
import { useVault } from "../../../../app/providers/VaultProvider";
import { openFastAccess } from "../../../fastaccess/utils/FastAccess";
import FolderSelectModal from "../modals/FolderSelectModal";
import FolderType from "../../model/FolderType";
import { getValueIcon } from "../../utils/getValueIcon";
import { getFolderColor } from "../../utils/folderAppearance";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
    height: 44,
    flexDirection: "row",
  },
  folderColorStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    zIndex: 2,
  },
  dragHandle: {
    width: 32,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  dragDivider: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
  },
  ripple: {
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  left: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    minWidth: 0,
    flexShrink: 1,
  },
  right: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  actionIconButton: {
    margin: 0,
  },
  actionMenuAnchor: {
    margin: 0,
  },
  title: {
    userSelect: "none",
    flexShrink: 1,
  },
  iconBox: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  chip: {
    margin: 0,
    height: 30,
    borderRadius: 12,
    minWidth: 0,
  },
  chipLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  chipRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  chipContent: {
    height: 30,
    paddingHorizontal: 8,
  },
  chipUser: {
    maxWidth: 150,
  },
  chipPass: {
    maxWidth: 120,
  },
  chipText: {
    userSelect: "none",
  },
  menuPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 220,
  },
  menuPreviewTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  menuPreviewAction: {
    margin: 0,
  },
  menuPreviewDivider: {
    height: 20,
    width: StyleSheet.hairlineWidth,
    opacity: 0.5,
  },
  swipeContainer: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  swipeAction: {
    width: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeActionLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  swipeActionRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

const ellipsize = (s: string, max = 16) => {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)) + "…";
};

const maskPassword = (pw: string, maxDots = 10) => {
  if (!pw) return "";
  const dots = "•".repeat(Math.min(pw.length, maxDots));
  return pw.length > maxDots ? `${dots}…` : dots;
};

type Props = {
  item: ValuesType;
  onPress: () => void;
  key?: React.Key;
  index: number;
  reorderMode?: boolean;
  onDragStart?: () => void;
  dragHandleProps?: any;
};

function ListItem(props: Props) {
  const { theme, darkmode } = useTheme();
  const { t } = useTranslation();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { copy } = useClipboardCopy();
  const vault = useVault();

  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRef = useRef<any>(null);
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const suppressNextPressRef = useRef(false);

  const [hovered, setHovered] = useState(false);
  const [dragHandleHovered, setDragHandleHovered] = useState(false);
  const [dragHandlePressed, setDragHandlePressed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [folderSelectVisible, setFolderSelectVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuOffsetY, setMenuOffsetY] = useState(6);
  const [faviconFailed, setFaviconFailed] = useState(false);

  const [usernameIcon, setUsernameIcon] = useState("account");
  const [passwordIcon, setPasswordIcon] = useState("form-textbox-password");

  const clearUsernameTimer = () => {
    if (usernameTimerRef.current) {
      clearTimeout(usernameTimerRef.current);
      usernameTimerRef.current = null;
    }
  };

  const clearPasswordTimer = () => {
    if (passwordTimerRef.current) {
      clearTimeout(passwordTimerRef.current);
      passwordTimerRef.current = null;
    }
  };

  const resetUsernameIcon = () => {
    clearUsernameTimer();
    setUsernameIcon("account");
  };

  const resetPasswordIcon = () => {
    clearPasswordTimer();
    setPasswordIcon("form-textbox-password");
  };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      clearUsernameTimer();
      clearPasswordTimer();
    };
  }, []);

  // Optional aber sinnvoll: wenn hover weg ist, nie "check" hängen lassen
  useEffect(() => {
    if (!hovered) {
      resetUsernameIcon();
      resetPasswordIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  const copyToClipboard = async (
    value: string,
    type: "username" | "password",
  ) => {
    if (!value) return;

    // Wenn ich username kopiere, soll password sofort wieder normal sein (und umgekehrt)
    if (type === "username") resetPasswordIcon();
    else resetUsernameIcon();

    const { durationMs } = await copy(value, {
      kind: type,
    });

    if (type === "username") {
      clearUsernameTimer();
      setUsernameIcon("check");
      usernameTimerRef.current = setTimeout(() => {
        setUsernameIcon("account");
        usernameTimerRef.current = null;
      }, 1000);
    } else {
      clearPasswordTimer();
      setPasswordIcon("check");
      passwordTimerRef.current = setTimeout(() => {
        setPasswordIcon("form-textbox-password");
        passwordTimerRef.current = null;
      }, 1000);
    }

    if (!durationMs || durationMs <= 0) return;
    emitClipboardCopied({
      durationMs,
      createdAt: Date.now(),
    });
  };

  const url = useMemo(() => {
    const urlModule = props.item.modules.find(
      (module) => module.module === ModulesEnum.URL,
    );
    const value = String(urlModule?.value ?? "").trim();

    return value
      ? `https://www.google.com/s2/favicons?domain=${value}&sz=64`
      : "";
  }, [props.item.modules]);

  useEffect(() => {
    setFaviconFailed(false);
  }, [url]);

  const icon = useMemo(
    () => getValueIcon({ modules: props.item.modules }),
    [props.item.modules],
  );
  const showFavicon = url !== "" && !faviconFailed;

  const fastAccessObject = useMemo(() => {
    if (!hovered) return null;
    return extractFastAccessObject(props.item.modules, props.item.title);
  }, [hovered, props.item.modules, props.item.title]);

  const fastAccessData = useMemo(
    () => extractFastAccessObject(props.item.modules, props.item.title),
    [props.item.modules, props.item.title],
  );
  const menuPreviewIcon = showFavicon ? null : icon;

  const updateListItem = (recipe: (entry: ValuesType) => ValuesType) => {
    vault.update((draft) => {
      draft.values = draft.values.map((entry) =>
        entry.id === props.item.id ? recipe(entry) : entry,
      );
    });
  };

  const toggleFavorite = () => {
    updateListItem((entry) => ({
      ...entry,
      fav: !entry.fav,
    }));
  };

  const listItemMenuItems = useMemo<AdaptiveMenuItem[]>(
    () => [
      ...(fastAccessData
        ? [
            {
              key: "fast-access",
              icon: "tooltip-account",
              label: t("common:fastAccess"),
              onPress: () => {
                openItemFastAccess().catch(() => {});
              },
            },
          ]
        : []),
      {
        key: "move-folder",
        icon: "folder",
        label: t("common:moveToFolder"),
        onPress: () => {
          setFolderSelectVisible(true);
        },
      },
      {
        key: "delete",
        icon: "trash-can",
        label: t("common:delete"),
        onPress: () => setDeleteModalVisible(true),
        withDivider: false,
      },
    ],
    [fastAccessData, t],
  );

  const menuTopContent = (
    <View style={styles.menuPreview}>
      {showFavicon ? (
        <Image
          style={{ width: 28, height: 28, borderRadius: 8 }}
          source={url}
          contentFit="cover"
          transition={250}
          onError={() => setFaviconFailed(true)}
        />
      ) : (
        <View style={styles.iconBox}>
          <Icon color={"lightgray"} source={menuPreviewIcon} size={24} />
        </View>
      )}
      <View style={styles.menuPreviewTextWrap}>
        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
          {t("common:selectedItem")}
        </Text>
        <Text variant="bodyLarge" numberOfLines={1}>
          {props.item.title}
        </Text>
      </View>
      <Divider
        style={[
          styles.menuPreviewDivider,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />
      <IconButton
        icon={props.item.fav ? "star" : "star-outline"}
        size={18}
        onPress={() => {
          toggleFavorite();
        }}
        style={styles.menuPreviewAction}
        iconColor={theme.colors.primary}
      />
    </View>
  );

  const measureAndOpenMenu = () => {
    const estimatedMenuHeight = 228;
    const estimatedMenuWidth = 244;
    const viewportPadding = 8;
    const downwardGap = 8;
    const upwardGap = -22;

    suppressNextPressRef.current = true;
    itemRef.current?.measureInWindow?.(
      (x: number, y: number, width: number, height: number) => {
        const menuLeft = Math.min(
          Math.max(viewportPadding, x + width - estimatedMenuWidth),
          Math.max(
            viewportPadding,
            windowWidth - estimatedMenuWidth - viewportPadding,
          ),
        );

        const anchorBottom = y + height;
        const desiredTopBelow = anchorBottom + downwardGap;
        const desiredTopAbove = y - estimatedMenuHeight - upwardGap;
        const fitsBelow =
          desiredTopBelow + estimatedMenuHeight <=
          windowHeight - viewportPadding;

        const unclampedTop = fitsBelow ? desiredTopBelow : desiredTopAbove;
        const clampedTop = Math.min(
          Math.max(viewportPadding, unclampedTop),
          Math.max(
            viewportPadding,
            windowHeight - estimatedMenuHeight - viewportPadding,
          ),
        );

        setMenuPosition({
          x: menuLeft,
          y,
        });
        setMenuOffsetY(clampedTop - y);
        setMenuVisible(true);
      },
    );
  };

  const openMenuAtPointer = (event: any) => {
    const estimatedMenuHeight = 228;
    const estimatedMenuWidth = 244;
    const viewportPadding = 8;
    const nativeEvent = event?.nativeEvent;
    const pointerX = nativeEvent?.pageX ?? nativeEvent?.clientX;
    const pointerY = nativeEvent?.pageY ?? nativeEvent?.clientY;

    if (typeof pointerX !== "number" || typeof pointerY !== "number") {
      measureAndOpenMenu();
      return;
    }

    suppressNextPressRef.current = true;

    const menuLeft = Math.min(
      Math.max(viewportPadding, pointerX),
      Math.max(
        viewportPadding,
        windowWidth - estimatedMenuWidth - viewportPadding,
      ),
    );
    const menuTop = Math.min(
      Math.max(viewportPadding, pointerY),
      Math.max(
        viewportPadding,
        windowHeight - estimatedMenuHeight - viewportPadding,
      ),
    );

    setMenuPosition({
      x: menuLeft,
      y: menuTop,
    });
    setMenuOffsetY(0);
    setMenuVisible(true);
  };

  const openItemFastAccess = async () => {
    if (!fastAccessData) return;

    if (Platform.OS === "web") {
      try {
        const tauri = require("@tauri-apps/api/webviewWindow");
        const win = await tauri.WebviewWindow.getByLabel("main");
        if (win) {
          await win.minimize();
        }
      } catch {}
    }

    await openFastAccess(
      fastAccessData.title,
      fastAccessData.username,
      fastAccessData.password,
    );
  };

  const webInteractionProps =
    Platform.OS === "web"
      ? ({
          onPointerEnter: () => setHovered(true),
          onPointerLeave: () => setHovered(false),
          onPointerDown: (event: any) => {
            const button = event?.nativeEvent?.button;

            if (button === 1) {
              suppressNextPressRef.current = true;
              event.preventDefault?.();
              event.stopPropagation?.();
              openItemFastAccess().catch(() => {});
            }
          },
          onContextMenu: (event: any) => {
            event.preventDefault?.();
            event.stopPropagation?.();
            openMenuAtPointer(event);
          },
        } as any)
      : {};

  const renderFavoriteSwipeAction = () => (
    <View
      style={[
        styles.swipeAction,
        styles.swipeActionLeft,
        {
          backgroundColor: props.item.fav
            ? theme.colors.secondaryContainer
            : theme.colors.primary,
        },
      ]}
    >
      <Icon
        color={props.item.fav ? theme.colors.primary : theme.colors.onPrimary}
        source={props.item.fav ? "star-off" : "star"}
        size={24}
      />
    </View>
  );

  const renderDeleteSwipeAction = () => (
    <View
      style={[
        styles.swipeAction,
        styles.swipeActionRight,
        { backgroundColor: theme.colors.error },
      ]}
    >
      <Icon color={theme.colors.onError} source="trash-can" size={24} />
    </View>
  );

  const dragHandleIcon = (
    <Icon
      color={darkmode ? theme.colors?.outline : theme.colors?.outlineVariant}
      source="drag"
      size={20}
    />
  );

  const webDragHandleProps = props.dragHandleProps ?? {};
  const folderColor = getFolderColor(props.item.folder);

  const dragHandle = props.reorderMode ? (
    Platform.OS === "web" ? (
      <div
        {...webDragHandleProps}
        onMouseEnter={(event) => {
          setDragHandleHovered(true);
          webDragHandleProps.onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setDragHandleHovered(false);
          setDragHandlePressed(false);
          webDragHandleProps.onMouseLeave?.(event);
        }}
        onMouseDown={(event) => {
          setDragHandlePressed(true);
          webDragHandleProps.onMouseDown?.(event);
        }}
        onMouseUp={(event) => {
          setDragHandlePressed(false);
          webDragHandleProps.onMouseUp?.(event);
        }}
        onTouchStart={(event) => {
          setDragHandlePressed(true);
          webDragHandleProps.onTouchStart?.(event);
        }}
        onTouchEnd={(event) => {
          setDragHandlePressed(false);
          webDragHandleProps.onTouchEnd?.(event);
        }}
        style={{
          width: 32,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <AnimatedPressable
          borderless={false}
          rippleColor="rgba(0, 0, 0, .12)"
          style={[
            styles.dragHandle,
            { pointerEvents: "none" as any },
            dragHandleHovered
              ? {
                  backgroundColor: darkmode
                    ? "rgba(255, 255, 255, .04)"
                    : "rgba(0, 0, 0, .035)",
                }
              : null,
            dragHandlePressed
              ? {
                  backgroundColor: darkmode
                    ? "rgba(255, 255, 255, .08)"
                    : "rgba(0, 0, 0, .07)",
                }
              : null,
          ]}
        >
          {dragHandleIcon}
        </AnimatedPressable>
      </div>
    ) : (
      <AnimatedPressable
        borderless={false}
        rippleColor="rgba(0, 0, 0, .12)"
        onPressIn={() => {
          setDragHandlePressed(true);
          props.onDragStart?.();
        }}
        onPressOut={() => setDragHandlePressed(false)}
        onPress={() => {}}
        style={[
          styles.dragHandle,
          dragHandlePressed
            ? {
                backgroundColor: darkmode
                  ? "rgba(255, 255, 255, .08)"
                  : "rgba(0, 0, 0, .07)",
              }
            : null,
        ]}
      >
        {dragHandleIcon}
      </AnimatedPressable>
    )
  ) : null;

  const dragDivider = props.reorderMode ? (
    <View
      style={[
        styles.dragDivider,
        {
          backgroundColor: darkmode
            ? theme.colors.outlineVariant
            : theme.colors.outline,
          opacity: darkmode ? 1 : 0.28,
        },
      ]}
    />
  ) : null;

  const listItemContent = (
    <Animated.View
      entering={
        props.reorderMode || props.index >= 12
          ? undefined
          : FadeInDown.delay(props.index * 35).duration(220)
      }
      key={props.key}
      ref={itemRef}
      style={[
        styles.container,
        Platform.OS !== "web"
          ? { marginLeft: 0, marginRight: 0, marginBottom: 0 }
          : null,
        props.reorderMode && Platform.OS !== "web"
          ? { marginLeft: 4, marginRight: 4, marginBottom: 4 }
          : null,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
        },
      ]}
      {...webInteractionProps}
    >
      {folderColor ? (
        <View
          pointerEvents="none"
          style={[styles.folderColorStrip, { backgroundColor: folderColor }]}
        />
      ) : null}
      {dragHandle}
      {dragDivider}
      <AnimatedPressable
        key={props.key}
        style={styles.ripple}
        onPress={() => {
          if (suppressNextPressRef.current) {
            suppressNextPressRef.current = false;
            return;
          }
          props.onPress();
        }}
        onLongPress={() => measureAndOpenMenu()}
      >
        <>
          <View style={styles.left}>
            {showFavicon ? (
              <Image
                style={{ width: 30, height: 30, margin: 0, borderRadius: 8 }}
                source={url}
                contentFit="cover"
                transition={250}
                pointerEvents="none"
                onError={() => setFaviconFailed(true)}
              />
            ) : (
              <View style={styles.iconBox}>
                <Icon color={"lightgray"} source={icon} size={26} />
              </View>
            )}

            <Text
              variant="bodyMedium"
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {props.item.title}
            </Text>
          </View>

          <View style={styles.right}>
            {hovered && fastAccessObject && (
              <View style={styles.chipRow}>
                <Button
                  mode="contained-tonal"
                  compact
                  icon={usernameIcon}
                  onPress={() =>
                    copyToClipboard(fastAccessObject.username, "username")
                  }
                  style={[styles.chip, styles.chipLeft, styles.chipUser]}
                  contentStyle={styles.chipContent}
                  textColor={theme.colors.primary}
                >
                  <Text numberOfLines={1} style={styles.chipText}>
                    {ellipsize(fastAccessObject.username, 18)}
                  </Text>
                </Button>

                <Button
                  mode="contained-tonal"
                  compact
                  icon={passwordIcon}
                  onPress={() =>
                    copyToClipboard(fastAccessObject.password, "password")
                  }
                  style={[styles.chip, styles.chipRight, styles.chipPass]}
                  contentStyle={styles.chipContent}
                  textColor={theme.colors.primary}
                >
                  <Text numberOfLines={1} style={styles.chipText}>
                    {maskPassword(fastAccessObject.password)}
                  </Text>
                </Button>
              </View>
            )}

            <Icon
              color={theme.colors?.primary}
              source={"chevron-right"}
              size={20}
            />
          </View>
        </>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <>
      {Platform.OS === "web" || props.reorderMode ? (
        listItemContent
      ) : (
        <ReanimatedSwipeable
          ref={swipeableRef}
          friction={2}
          leftThreshold={48}
          rightThreshold={48}
          dragOffsetFromLeftEdge={18}
          dragOffsetFromRightEdge={18}
          overshootLeft={false}
          overshootRight={false}
          containerStyle={styles.swipeContainer}
          renderLeftActions={renderFavoriteSwipeAction}
          renderRightActions={renderDeleteSwipeAction}
          onSwipeableOpen={(direction) => {
            swipeableRef.current?.close();

            if (direction === "right") {
              toggleFavorite();
              return;
            }

            setDeleteModalVisible(true);
          }}
        >
          {listItemContent}
        </ReanimatedSwipeable>
      )}
      <AdaptiveMenu
        visible={menuVisible}
        setVisible={setMenuVisible}
        positionY={menuPosition.y}
        positionX={menuPosition.x}
        offsetY={menuOffsetY}
        items={listItemMenuItems}
        topContent={menuTopContent}
      />
      <DeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onDelete={() => {
          vault.deleteEntry(props.item.id);
          setDeleteModalVisible(false);
        }}
      />
      <FolderSelectModal
        visible={folderSelectVisible}
        setVisible={setFolderSelectVisible}
        folders={vault.folders ?? []}
        selectedFolder={props.item.folder}
        onSelectFolder={(folder: FolderType | null) => {
          updateListItem((entry) => ({
            ...entry,
            folder,
          }));
          setFolderSelectVisible(false);
        }}
      />
    </>
  );
}

export default React.memo(ListItem);
