import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  useWindowDimensions,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { Searchbar, Text, Icon, IconButton, Chip } from "react-native-paper";
import Modal from "../../../../shared/components/modals/Modal";
import ModulesEnum from "../../model/ModulesEnum";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";

import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useSetting } from "../../../../app/providers/SettingsProvider";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";

type ModuleCategory =
  | "LoginAccess"
  | "ContactIdentity"
  | "PaymentDocuments"
  | "SecurityCodes"
  | "NotesFiles"
  | "NetworkTechnical"
  | "Custom";

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
  const categoryScrollRef: any = useRef<ScrollView>(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  // IMPORTANT: defineModules(...) enforces that all UiModules appear exactly somewhere here
  const MODULES = defineModules([
    {
      id: ModulesEnum.ADDRESS,
      label: t("modules:address"),
      icon: MODULE_ICON[ModulesEnum.ADDRESS],
      category: "ContactIdentity",
      keywords: [
        "adresse",
        "address",
        "street",
        "straße",
        "location",
        "ort",
        "city",
        "stadt",
        "kontakt",
        "contact",
        "vcard",
      ],
    },
    {
      id: ModulesEnum.USERNAME,
      label: t("modules:username"),
      icon: MODULE_ICON[ModulesEnum.USERNAME],
      category: "LoginAccess",
      keywords: ["user", "login", "account", "benutzer", "name"],
    },
    {
      id: ModulesEnum.E_MAIL,
      label: t("modules:email"),
      icon: MODULE_ICON[ModulesEnum.E_MAIL],
      category: "ContactIdentity",
      keywords: ["mail", "email", "kontakt", "contact", "vcard"],
    },
    {
      id: ModulesEnum.COMPANY,
      label: t("modules:company"),
      icon: MODULE_ICON[ModulesEnum.COMPANY],
      category: "ContactIdentity",
      keywords: [
        "firma",
        "company",
        "work",
        "job",
        "office",
        "department",
        "abteilung",
        "rolle",
        "position",
        "kontakt",
        "contact",
        "vcard",
      ],
    },
    {
      id: ModulesEnum.DOCUMENT,
      label: t("modules:document"),
      icon: MODULE_ICON[ModulesEnum.DOCUMENT],
      category: "PaymentDocuments",
      keywords: [
        "document",
        "dokument",
        "passport",
        "pass",
        "license",
        "lizenz",
        "id",
        "ausweis",
        "identity",
        "nummer",
        "card",
        "karte",
      ],
    },
    {
      id: ModulesEnum.CREDIT_CARD,
      label: t("modules:creditCard"),
      icon: MODULE_ICON[ModulesEnum.CREDIT_CARD],
      category: "PaymentDocuments",
      keywords: [
        "credit",
        "kreditkarte",
        "card",
        "karte",
        "payment",
        "zahlung",
        "bank",
        "cvv",
        "cvc",
      ],
    },
    {
      id: ModulesEnum.PASSWORD,
      label: t("modules:password"),
      icon: MODULE_ICON[ModulesEnum.PASSWORD],
      category: "LoginAccess",
      keywords: ["passwort", "password", "credential", "login", "secret"],
    },
    {
      id: ModulesEnum.PERSON,
      label: t("modules:person"),
      icon: MODULE_ICON[ModulesEnum.PERSON],
      category: "ContactIdentity",
      keywords: [
        "person",
        "kontakt",
        "contact",
        "name",
        "profil",
        "profile",
        "identity",
        "identität",
      ],
    },
    {
      id: ModulesEnum.PIN,
      label: t("modules:pin"),
      icon: MODULE_ICON[ModulesEnum.PIN],
      category: "LoginAccess",
      keywords: ["pin", "code", "numeric", "device", "gerät", "login"],
    },
    {
      id: ModulesEnum.WIFI,
      label: t("modules:wifi"),
      icon: MODULE_ICON[ModulesEnum.WIFI],
      category: "NetworkTechnical",
      keywords: ["wlan", "wifi", "network", "ssid", "router", "netzwerk"],
    },
    {
      id: ModulesEnum.URL,
      label: t("modules:url"),
      icon: MODULE_ICON[ModulesEnum.URL],
      category: "LoginAccess",
      keywords: ["link", "website", "http", "url", "domain", "site"],
    },
    {
      id: ModulesEnum.DIGITAL_CARD,
      label: t("modules:digitalCard"),
      icon: MODULE_ICON[ModulesEnum.DIGITAL_CARD],
      category: "PaymentDocuments",
      keywords: [
        "card",
        "karte",
        "kundenkarte",
        "loyalty",
        "barcode",
        "qr",
        "mitglied",
      ],
    },
    {
      id: ModulesEnum.KEY,
      label: t("modules:key"),
      icon: MODULE_ICON[ModulesEnum.KEY],
      category: "NetworkTechnical",
      keywords: ["ssh", "api", "token", "key", "schlüssel", "private", "public"],
    },
    {
      id: ModulesEnum.CUSTOM_FIELD,
      label: t("modules:customField"),
      icon: MODULE_ICON[ModulesEnum.CUSTOM_FIELD],
      category: "Custom",
      keywords: ["frei", "custom", "field", "meta", "extra", "eigene", "datum"],
    },
    {
      id: ModulesEnum.PHONE_NUMBER,
      label: t("modules:phoneNumber"),
      icon: MODULE_ICON[ModulesEnum.PHONE_NUMBER],
      category: "ContactIdentity",
      keywords: [
        "telefon",
        "phone",
        "mobile",
        "mobil",
        "call",
        "anrufen",
        "kontakt",
        "contact",
        "vcard",
      ],
    },
    {
      id: ModulesEnum.TASK,
      label: t("modules:task"),
      icon: MODULE_ICON[ModulesEnum.TASK],
      category: "NotesFiles",
      keywords: ["todo", "task", "aufgabe", "reminder", "checklist"],
    },
    {
      id: ModulesEnum.TOTP,
      label: t("modules:totp"),
      icon: MODULE_ICON[ModulesEnum.TOTP],
      category: "SecurityCodes",
      keywords: ["2fa", "otp", "totp", "mfa"],
    },
    {
      id: ModulesEnum.RECOVERY_CODES,
      label: t("modules:recoveryCodes"),
      icon: MODULE_ICON[ModulesEnum.RECOVERY_CODES],
      category: "SecurityCodes",
      keywords: [
        "2fa",
        "otp",
        "totp",
        "mfa",
        "recovery",
        "codes",
        "backup",
        "wiederherstellung",
      ],
    },
    {
      id: ModulesEnum.ATTACHMENT,
      label: t("modules:attachment"),
      icon: MODULE_ICON[ModulesEnum.ATTACHMENT],
      category: "NotesFiles",
      keywords: [
        "file",
        "datei",
        "anhang",
        "attachment",
        "document",
        "dokument",
        "upload",
      ],
    },
    {
      id: ModulesEnum.NOTE,
      label: t("modules:note"),
      icon: MODULE_ICON[ModulesEnum.NOTE],
      category: "NotesFiles",
      keywords: ["notiz", "note", "text", "memo", "markdown", "code"],
    },
    {
      id: ModulesEnum.EXPIRY,
      label: t("modules:expiry"),
      icon: MODULE_ICON[ModulesEnum.EXPIRY],
      category: "NetworkTechnical",
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

  const categoryLabels = useMemo(
    () =>
      ({
        LoginAccess: t("modules:addCategoryLoginAccess"),
        ContactIdentity: t("modules:addCategoryContactIdentity"),
        PaymentDocuments: t("modules:addCategoryPaymentDocuments"),
        SecurityCodes: t("modules:addCategorySecurityCodes"),
        NotesFiles: t("modules:addCategoryNotesFiles"),
        NetworkTechnical: t("modules:addCategoryNetworkTechnical"),
        Custom: t("modules:addCategoryCustom"),
      }) satisfies Record<ModuleCategory, string>,
    [t],
  );
  const categories: ModuleCategory[] = [
    "LoginAccess",
    "ContactIdentity",
    "PaymentDocuments",
    "SecurityCodes",
    "NotesFiles",
    "NetworkTechnical",
    "Custom",
  ];
  const [activeCats, setActiveCats] = useState<Set<ModuleCategory>>(new Set());
  const categoryOffsetRef = useRef(0);
  const handleCategoryWheel = (event: any) => {
    if (Platform.OS !== "web") return;
    const delta = event?.nativeEvent?.deltaY ?? event?.deltaY ?? 0;
    if (!delta) return;
    event?.preventDefault?.();
    categoryOffsetRef.current = Math.max(0, categoryOffsetRef.current + delta);
    categoryScrollRef.current?.scrollTo?.({
      x: categoryOffsetRef.current,
      animated: false,
    });
  };
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
        const hay = (
          m.label +
          " " +
          categoryLabels[m.category] +
          " " +
          m.keywords.join(" ")
        ).toLowerCase();
        return tokens.every((tok) => hay.includes(tok));
      });
    }
    return list;
  }, [activeCats, normalizedQuery, MODULES, categoryLabels]);

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

    categories.forEach((category) => {
      const data = allItems.filter((m) => m.category === category);
      if (data.length) s.push({ title: categoryLabels[category], data });
    });
    return s.filter((sec) => sec.data.length > 0);
  }, [categoryLabels, filtered, favs, props.recent]);

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
    c === "LoginAccess"
      ? "shield-lock"
      : c === "ContactIdentity"
        ? "account-box"
        : c === "PaymentDocuments"
          ? "credit-card-outline"
          : c === "SecurityCodes"
            ? "two-factor-authentication"
            : c === "NotesFiles"
              ? "note-text-outline"
              : c === "NetworkTechnical"
                ? "lan"
                : c === "Custom"
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
          ref={categoryScrollRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator
          horizontal
          style={{ maxHeight: 36 }}
          contentContainerStyle={{ gap: 6, paddingRight: 4 }}
          {...(Platform.OS === "web" ? { onWheel: handleCategoryWheel } : {})}
        >
          {(categories as ModuleCategory[]).map((c) => {
            const selected = activeCats.has(c);
            return (
              <TinyFilterChip
                key={c}
                label={categoryLabels[c]}
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
