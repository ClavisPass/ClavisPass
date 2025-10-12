import React, { useMemo, useState, useCallback } from "react";
import { useWindowDimensions, View, ScrollView } from "react-native";
import {
  Searchbar,
  Text,
  Icon,
  useTheme,
  IconButton,
  Chip,
} from "react-native-paper";
import Modal from "./Modal";
import ModulesEnum from "../../enums/ModulesEnum";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import AnimatedPressable from "../AnimatedPressable";

type ModuleCategory = "Common" | "Security" | "Contact" | "Utility";

type ModuleMeta = {
  id: ModulesEnum;
  label: string;
  icon: ModuleIconsEnum | string;
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

const MODULES: ModuleMeta[] = [
  {
    id: ModulesEnum.USERNAME,
    label: "Username",
    icon: ModuleIconsEnum.USERNAME,
    category: "Common",
    keywords: ["user", "login", "account"],
  },
  {
    id: ModulesEnum.E_MAIL,
    label: "E-Mail",
    icon: ModuleIconsEnum.E_MAIL,
    category: "Common",
    keywords: ["mail", "email", "kontakt"],
  },
  {
    id: ModulesEnum.PASSWORD,
    label: "Password",
    icon: ModuleIconsEnum.PASSWORD,
    category: "Security",
    keywords: ["passwort", "credential", "login"],
  },
  {
    id: ModulesEnum.WIFI,
    label: "Wi-Fi",
    icon: ModuleIconsEnum.WIFI,
    category: "Utility",
    keywords: ["wlan", "network", "ssid"],
  },
  {
    id: ModulesEnum.URL,
    label: "URL",
    icon: ModuleIconsEnum.URL,
    category: "Common",
    keywords: ["link", "website", "http"],
  },
  {
    id: ModulesEnum.DIGITAL_CARD,
    label: "Digital Card",
    icon: ModuleIconsEnum.DIGITAL_CARD,
    category: "Contact",
    keywords: ["vcard", "kontakt", "profile"],
  },
  {
    id: ModulesEnum.KEY,
    label: "Key",
    icon: ModuleIconsEnum.KEY,
    category: "Security",
    keywords: ["ssh", "api", "token"],
  },
  {
    id: ModulesEnum.CUSTOM_FIELD,
    label: "Custom Field",
    icon: ModuleIconsEnum.CUSTOM_FIELD,
    category: "Utility",
    keywords: ["frei", "meta", "notizen"],
  },
  {
    id: ModulesEnum.PHONE_NUMBER,
    label: "Phone Number",
    icon: ModuleIconsEnum.PHONE_NUMBER,
    category: "Contact",
    keywords: ["telefon", "mobil", "kontakt"],
  },
  {
    id: ModulesEnum.TASK,
    label: "Task",
    icon: ModuleIconsEnum.TASK,
    category: "Utility",
    keywords: ["todo", "aufgabe", "reminder"],
  },
  {
    id: ModulesEnum.TOTP,
    label: "Two-Factor Auth",
    icon: ModuleIconsEnum.TOTP,
    category: "Security",
    keywords: ["2fa", "otp", "totp", "mfa"],
  },
  {
    id: ModulesEnum.NOTE,
    label: "Note",
    icon: ModuleIconsEnum.NOTE,
    category: "Utility",
    keywords: ["notiz", "text", "memo"],
  },
  {
    id: ModulesEnum.EXPIRY,
    label: "Expiry",
    icon: ModuleIconsEnum.EXPIRY,
    category: "Utility",
    keywords: ["ablauf", "gültig", "verfall"],
  },
];

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
      selected={selected}
      mode={selected ? "flat" : "outlined"}
      onPress={onPress}
      style={{ height: 28, borderRadius: 12 }}
      textStyle={{
        fontSize: 12,
        lineHeight: 14,
        includeFontPadding: false as any,
      }}
      accessibilityLabel={`Filter ${label}${selected ? " aktiv" : ""}`}
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
  icon: ModuleIconsEnum | string;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}) {
  const theme = useTheme();

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
  const theme = useTheme();
  const { height: winH, width: winW } = useWindowDimensions();
  const hideModal = () => props.setVisible(false);

  const [query, setQuery] = useState("");
  const [localFavs, setLocalFavs] = useState<ModulesEnum[]>([]);
  const favs = props.favorites ?? localFavs;

  const categories: ModuleCategory[] = [
    "Common",
    "Security",
    "Contact",
    "Utility",
  ];
  const [activeCats, setActiveCats] = useState<Set<ModuleCategory>>(new Set());
  const toggleCat = (c: ModuleCategory) =>
    setActiveCats((s) => {
      const next = new Set(s);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = MODULES;
    if (activeCats.size > 0)
      list = list.filter((m) => activeCats.has(m.category));
    if (normalizedQuery.length > 0) {
      const tokens = normalizedQuery.split(/\s+/);
      list = list.filter((m) => {
        const hay = (m.label + " " + m.keywords.join(" ")).toLowerCase();
        return tokens.every((t) => hay.includes(t));
      });
    }
    return list;
  }, [activeCats, normalizedQuery]);

  const sections = useMemo(() => {
    const byId = new Map(filtered.map((m) => [m.id, m]));
    const favItems = favs
      .map((id) => byId.get(id))
      .filter(Boolean) as ModuleMeta[];
    const recentItems = (props.recent ?? [])
      .map((id) => byId.get(id))
      .filter(Boolean) as ModuleMeta[];
    const taken = new Set([
      ...favItems.map((m) => m.id),
      ...recentItems.map((m) => m.id),
    ]);
    const allItems = filtered.filter((m) => !taken.has(m.id));

    const s: Array<{ title: string; data: ModuleMeta[] }> = [];
    if (favItems.length) s.push({ title: "Favorites", data: favItems });
    if (recentItems.length)
      s.push({ title: "Recently Used", data: recentItems });
    s.push({ title: "All Modules", data: allItems });
    return s.filter((sec) => sec.data.length > 0);
  }, [filtered, favs, props.recent]);

  const handleSelect = useCallback(
    (m: ModuleMeta) => {
      props.addModule(m.id);
      props.onSelect?.(m.id);
      hideModal();
    },
    [props]
  );

  const isFavorite = (id: ModulesEnum) => favs.includes(id);
  const toggleFavorite = (id: ModulesEnum) => {
    const nowFav = !isFavorite(id);
    if (props.onToggleFavorite) props.onToggleFavorite(id, nowFav);
    else {
      setLocalFavs((prev) => {
        const set = new Set(prev);
        nowFav ? set.add(id) : set.delete(id);
        return Array.from(set);
      });
    }
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
      ? "shield-lock-outline"
      : c === "Contact"
        ? "account-box-outline"
        : c === "Utility"
          ? "wrench-outline"
          : "view-dashboard-outline";

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          width: containerWidth,
          height: containerMaxHeight,
          padding: 8,
          gap: 8,
        }}
      >
        <Searchbar
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          style={{ height: 40, borderRadius: 12 }}
        />

        <View style={{ flexDirection: "row", gap: 6 }}>
          {(
            ["Common", "Security", "Contact", "Utility"] as ModuleCategory[]
          ).map((c) => {
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
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
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
                      Array.from({ length: columns - row.length }).map(
                        (_, k) => (
                          <View
                            key={`spacer-${k}`}
                            style={{ flex: 1, padding: 6 }}
                          />
                        )
                      )}
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
