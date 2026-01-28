import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  useWindowDimensions,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Searchbar, Text, Icon, IconButton, Chip } from "react-native-paper";
import Modal from "../../../../shared/components/modals/Modal";
import ModulesEnum from "../../model/ModulesEnum";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";

import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useSetting } from "../../../../app/providers/SettingsProvider";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";

type ModuleCategory = "Common" | "Security" | "vCard" | "Utility";

// UI shows only these modules (exclude internal/structural ones)
type UiModules = Exclude<ModulesEnum, ModulesEnum.UNKNOWN | ModulesEnum.TITLE>;

type ModuleMeta = {
  id: UiModules;
  label: string;
  icon: string;
  category: ModuleCategory;
  keywords: string[];
};

type Props = {
  addModule: (module: ModulesEnum) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;

  favorites?: ModulesEnum[];
  recent?: ModulesEnum[];
  onToggleFavorite?: (module: ModulesEnum, isFavorite: boolean) => void;
  onSelect?: (module: ModulesEnum) => void;
};

// ----- Compile-time coverage check helpers -----
type IdsOf<T extends readonly { id: any }[]> = T[number]["id"];

type MissingIds<List extends readonly { id: UiModules }[]> = Exclude<
  UiModules,
  IdsOf<List>
>;

function defineModules<const L extends readonly ModuleMeta[]>(
  list: MissingIds<L> extends never ? L : never
) {
  return list;
}

function TinyFilterChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Chip
      icon={() => null}
      selected={selected}
      showSelectedOverlay={true}
      onPress={onPress}
      style={{ borderRadius: 12, marginRight: 4 }}
    >
      {label}
    </Chip>
  );
}

function ModuleTile({
  label,
  icon,
  onPress,
  onToggleFavorite,
  isFavorite,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, padding: 4 }}>
      <View
        style={{
          borderRadius: 12,
          overflow: "hidden",
          flex: 1,
          backgroundColor: theme.colors?.secondaryContainer,
        }}
      >
        <IconButton
          icon={isFavorite ? "star" : "star-outline"}
          size={16}
          onPress={(e: any) => {
            e?.stopPropagation?.();
            onToggleFavorite();
          }}
          style={{
            position: "absolute",
            right: 2,
            top: 2,
            zIndex: 2,
            width: 28,
            height: 28,
          }}
          accessibilityLabel={
            isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
          }
        />

        <AnimatedPressable
          onPress={onPress}
          style={[{ cursor: "pointer", flex: 1 }]}
        >
          <View
            style={{
              display: "flex",
              padding: 8,
              gap: 4,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              minHeight: 68,
            }}
          >
            <Icon size={20} color={theme.colors.primary} source={icon} />
            <Text
              variant="bodyLarge"
              style={{ userSelect: "none" }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default function AddModuleModalCompactFav(props: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { height: winH, width: winW } = useWindowDimensions();
  const hideModal = () => props.setVisible(false);

  const [query, setQuery] = useState("");

  // Settings-backed favorites (uncontrolled)
  const { value: storedFavs, setValue: setStoredFavs } =
    useSetting("FAVORITE_MODULES");

  // Controlled overrides stored
  const favs = props.favorites ?? storedFavs;

  const ScrollViewRef: any = useRef<ScrollView>(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  // IMPORTANT: defineModules(...) enforces that all UiModules appear exactly somewhere here
  const MODULES = defineModules([
    {
      id: ModulesEnum.USERNAME,
      label: t("modules:username"),
      icon: MODULE_ICON[ModulesEnum.USERNAME],
      category: "Common",
      keywords: ["user", "login", "account"],
    },
    {
      id: ModulesEnum.E_MAIL,
      label: t("modules:email"),
      icon: MODULE_ICON[ModulesEnum.E_MAIL],
      category: "Common",
      keywords: ["mail", "email", "kontakt"],
    },
    {
      id: ModulesEnum.PASSWORD,
      label: t("modules:password"),
      icon: MODULE_ICON[ModulesEnum.PASSWORD],
      category: "Security",
      keywords: ["passwort", "credential", "login"],
    },
    {
      id: ModulesEnum.WIFI,
      label: t("modules:wifi"),
      icon: MODULE_ICON[ModulesEnum.WIFI],
      category: "Utility",
      keywords: ["wlan", "network", "ssid"],
    },
    {
      id: ModulesEnum.URL,
      label: t("modules:url"),
      icon: MODULE_ICON[ModulesEnum.URL],
      category: "Common",
      keywords: ["link", "website", "http"],
    },
    {
      id: ModulesEnum.DIGITAL_CARD,
      label: t("modules:digitalCard"),
      icon: MODULE_ICON[ModulesEnum.DIGITAL_CARD],
      category: "Utility",
      keywords: ["card", "kontakt", "profile"],
    },
    {
      id: ModulesEnum.KEY,
      label: t("modules:key"),
      icon: MODULE_ICON[ModulesEnum.KEY],
      category: "Security",
      keywords: ["ssh", "api", "token"],
    },
    {
      id: ModulesEnum.CUSTOM_FIELD,
      label: t("modules:customField"),
      icon: MODULE_ICON[ModulesEnum.CUSTOM_FIELD],
      category: "Utility",
      keywords: ["frei", "meta", "notizen"],
    },
    {
      id: ModulesEnum.PHONE_NUMBER,
      label: t("modules:phoneNumber"),
      icon: MODULE_ICON[ModulesEnum.PHONE_NUMBER],
      category: "vCard",
      keywords: ["telefon", "mobil", "kontakt"],
    },
    {
      id: ModulesEnum.TASK,
      label: t("modules:task"),
      icon: MODULE_ICON[ModulesEnum.TASK],
      category: "Utility",
      keywords: ["todo", "aufgabe", "reminder"],
    },
    {
      id: ModulesEnum.TOTP,
      label: t("modules:totp"),
      icon: MODULE_ICON[ModulesEnum.TOTP],
      category: "Security",
      keywords: ["2fa", "otp", "totp", "mfa"],
    },
    {
      id: ModulesEnum.RECOVERY_CODES,
      label: t("modules:recoveryCodes"),
      icon: MODULE_ICON[ModulesEnum.RECOVERY_CODES],
      category: "Security",
      keywords: ["2fa", "otp", "totp", "mfa", "recovery", "codes"],
    },
    {
      id: ModulesEnum.NOTE,
      label: t("modules:note"),
      icon: MODULE_ICON[ModulesEnum.NOTE],
      category: "Utility",
      keywords: ["notiz", "text", "memo"],
    },
    {
      id: ModulesEnum.EXPIRY,
      label: t("modules:expiry"),
      icon: MODULE_ICON[ModulesEnum.EXPIRY],
      category: "Utility",
      keywords: ["ablauf", "gültig", "verfall"],
    },
  ] as const);

  const change = (direction: "+" | "-") => {
    const { width } = Dimensions.get("window");
    let nextOffset = 0;
    if (direction === "+") nextOffset = currentOffset + width - 100;
    if (direction === "-") nextOffset = currentOffset - width - 100;
    ScrollViewRef?.current?.scrollToOffset({
      animated: true,
      offset: nextOffset,
    });
    setCurrentOffset(nextOffset);
  };

  const categories: ModuleCategory[] = ["Common", "Security", "vCard", "Utility"];
  const [activeCats, setActiveCats] = useState<Set<ModuleCategory>>(new Set());
  const toggleCat = (c: ModuleCategory) =>
    setActiveCats((s) => {
      const next = new Set(s);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = MODULES as readonly ModuleMeta[];
    if (activeCats.size > 0)
      list = list.filter((m) => activeCats.has(m.category));
    if (normalizedQuery.length > 0) {
      const tokens = normalizedQuery.split(/\s+/);
      list = list.filter((m) => {
        const hay = (m.label + " " + m.keywords.join(" ")).toLowerCase();
        return tokens.every((tok) => hay.includes(tok));
      });
    }
    return list;
  }, [activeCats, normalizedQuery, MODULES]);

  const sections = useMemo(() => {
    const byId = new Map(filtered.map((m) => [m.id, m]));
    const favItems = (favs as ModulesEnum[])
      .map((id) => byId.get(id as UiModules))
      .filter(Boolean) as ModuleMeta[];
    const recentItems = (props.recent ?? [])
      .map((id) => byId.get(id as UiModules))
      .filter(Boolean) as ModuleMeta[];

    const taken = new Set([
      ...favItems.map((m) => m.id),
      ...recentItems.map((m) => m.id),
    ]);

    const allItems = filtered.filter((m) => !taken.has(m.id));

    const s: Array<{ title: string; data: ModuleMeta[] }> = [];
    if (favItems.length) s.push({ title: t("common:favorites"), data: favItems });
    if (recentItems.length)
      s.push({ title: t("common:recentlyUsed"), data: recentItems });
    s.push({ title: t("common:allModules"), data: allItems });
    return s.filter((sec) => sec.data.length > 0);
  }, [filtered, favs, props.recent]);

  const handleSelect = useCallback(
    (m: ModuleMeta) => {
      // UiModules is a subset of ModulesEnum, so this is safe
      props.addModule(m.id);
      props.onSelect?.(m.id);
      hideModal();
    },
    [props]
  );

  const isFavorite = (id: ModulesEnum) => (favs as ModulesEnum[]).includes(id);

  const toggleFavorite = (id: ModulesEnum) => {
    const nowFav = !isFavorite(id);

    if (props.onToggleFavorite) {
      props.onToggleFavorite(id, nowFav);
      return;
    }

    if (!props.favorites) {
      const next = new Set(storedFavs);
      nowFav ? next.add(id) : next.delete(id);
      setStoredFavs(Array.from(next));
      return;
    }

    const base = new Set(props.favorites);
    nowFav ? base.add(id) : base.delete(id);
    setStoredFavs(Array.from(base));
  };

  const containerWidth = Math.min(400, winW - 32);
  const containerMaxHeight = Math.max(360, Math.min(640, winH - 160));
  const columns = 2;

  const chunk = <T,>(arr: T[], size: number) => {
    const rows: T[][] = [];
    for (let i = 0; i < arr.length; i += size)
      rows.push(arr.slice(i, i + size));
    return rows;
  };

  const EmptyState = () => (
    <View style={{ alignItems: "center", padding: 16 }}>
      <Text variant="titleSmall" style={{ marginBottom: 4 }}>
        No results found
      </Text>
      <Text variant="bodySmall" style={{ opacity: 0.7, textAlign: "center" }}>
        Adjust search or filter to find modules.
      </Text>
    </View>
  );

  const catIcon = (c: ModuleCategory) =>
    c === "Security"
      ? "shield-lock"
      : c === "vCard"
        ? "account-box"
        : c === "Utility"
          ? "wrench"
          : "view-dashboard";

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          width: containerWidth,
          height: containerMaxHeight,
          padding: 8,
          gap: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
          borderRadius: 12,
        }}
      >
        <Searchbar
          inputStyle={{ height: 40, minHeight: 40 }}
          style={{
            height: 40,
            borderRadius: 10,
            backgroundColor: "rgba(217, 217, 217, 0.21)",
          }}
          placeholder="Search"
          onChangeText={setQuery}
          value={query}
        />

        <ScrollView
          ref={ScrollViewRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ gap: 6, maxHeight: 36 }}
        >
          {(categories as ModuleCategory[]).map((c) => {
            const selected = activeCats.has(c);
            return (
              <TinyFilterChip
                key={c}
                label={c}
                icon={catIcon(c)}
                selected={selected}
                onPress={() => toggleCat(c)}
              />
            );
          })}
        </ScrollView>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 8 }}>
          {sections.length === 0 && <EmptyState />}

          {sections.map((sec) => {
            const rows = chunk(sec.data, columns);
            return (
              <View key={sec.title} style={{ marginBottom: 8 }}>
                <Text
                  variant="labelSmall"
                  style={{
                    opacity: 0.7,
                    marginBottom: 4,
                    paddingHorizontal: 4,
                  }}
                  accessibilityRole="header"
                >
                  {sec.title}
                </Text>

                {rows.map((row, i) => (
                  <View key={i} style={{ flexDirection: "row" }}>
                    {row.map((m) => (
                      <View key={String(m.id)} style={{ flex: 1 }}>
                        <ModuleTile
                          label={m.label}
                          icon={m.icon}
                          isFavorite={isFavorite(m.id)}
                          onToggleFavorite={() => toggleFavorite(m.id)}
                          onPress={() => handleSelect(m)}
                        />
                      </View>
                    ))}
                    {row.length < columns &&
                      Array.from({ length: columns - row.length }).map((_, k) => (
                        <View key={`spacer-${k}`} style={{ flex: 1, padding: 6 }} />
                      ))}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}
