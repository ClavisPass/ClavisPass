import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import CreditCardModuleType from "../../model/modules/CreditCardModuleType";
import moduleFormStyles from "./moduleFormStyles";

type CreditCardState = Pick<
  CreditCardModuleType,
  | "cardholderName"
  | "number"
  | "brand"
  | "expiryMonth"
  | "expiryYear"
  | "securityCode"
  | "bankName"
  | "note"
>;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string): string {
  const digits = digitsOnly(value).slice(0, 19);
  const groupPattern = digits.startsWith("34") || digits.startsWith("37")
    ? [4, 6, 5]
    : [4, 4, 4, 4, 3];
  const groups: string[] = [];
  let index = 0;

  groupPattern.forEach((size) => {
    const group = digits.slice(index, index + size);
    if (group) groups.push(group);
    index += size;
  });

  return groups.join(" ");
}

function maskCardNumber(value: string): string {
  const formatted = formatCardNumber(value);
  const digits = digitsOnly(formatted);
  if (digits.length <= 4) return formatted;

  let visibleSeen = 0;
  return formatted
    .split("")
    .reverse()
    .map((char) => {
      if (!/\d/.test(char)) return char;
      visibleSeen += 1;
      return visibleSeen <= 4 ? char : "•";
    })
    .reverse()
    .join("");
}

function detectCardBrand(value: string): string {
  const digits = digitsOnly(value);
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^6(?:011|5|4[4-9])/.test(digits)) return "Discover";
  if (/^3(?:0[0-5]|[68])/.test(digits)) return "Diners Club";
  if (/^35/.test(digits)) return "JCB";
  if (/^62/.test(digits)) return "UnionPay";
  return "";
}

function passesLuhn(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 12) return true;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function CreditCardModule(props: CreditCardModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const hasAdditionalValues = Boolean(
    props.brand ||
      props.expiryMonth ||
      props.expiryYear ||
      props.bankName ||
      props.note,
  );
  const [expanded, setExpanded] = useState(hasAdditionalValues);
  const [numberVisible, setNumberVisible] = useState(false);
  const [card, setCard] = useState<CreditCardState>({
    cardholderName: props.cardholderName ?? "",
    number: props.number ?? "",
    brand: props.brand ?? "",
    expiryMonth: props.expiryMonth ?? "",
    expiryYear: props.expiryYear ?? "",
    securityCode: props.securityCode ?? "",
    bankName: props.bankName ?? "",
    note: props.note ?? "",
  });

  useEffect(() => {
    setCard({
      cardholderName: props.cardholderName ?? "",
      number: props.number ?? "",
      brand: props.brand ?? "",
      expiryMonth: props.expiryMonth ?? "",
      expiryYear: props.expiryYear ?? "",
      securityCode: props.securityCode ?? "",
      bankName: props.bankName ?? "",
      note: props.note ?? "",
    });
    didMount.current = false;
  }, [props.id]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: CreditCardModuleType = {
        id: props.id,
        module: props.module,
        ...card,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [card]);

  const cardNumberDigits = useMemo(() => digitsOnly(card.number ?? ""), [card.number]);
  const isCardNumberPlausible = useMemo(
    () => passesLuhn(card.number ?? ""),
    [card.number],
  );

  const changeField =
    (field: keyof CreditCardState) =>
    (value: string) => {
      setCard((current) => ({ ...current, [field]: value }));
    };

  const changeCardNumber = (value: string) => {
    const formattedNumber = formatCardNumber(value);
    const detectedBrand = detectCardBrand(formattedNumber);
    setCard((current) => ({
      ...current,
      number: formattedNumber,
      brand:
        !current.brand || current.brand === detectCardBrand(current.number ?? "")
          ? detectedBrand
          : current.brand,
    }));
  };

  const input = (
    field: keyof CreditCardState,
    label: string,
    autoFocus = false,
    keyboardType: "default" | "number-pad" = "default",
  ) => (
    <View style={moduleFormStyles.inputShell}>
      <TextInput
        autoFocus={autoFocus}
        outlineStyle={globalStyles.outlineStyle}
        style={[globalStyles.textInputStyle, moduleFormStyles.input]}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={card[field] ?? ""}
        placeholder={label}
        mode="outlined"
        onChangeText={changeField(field)}
        autoCapitalize={field === "number" || field === "securityCode" ? "none" : "words"}
        keyboardType={keyboardType}
      />
    </View>
  );

  const numberInput = (
    <View style={moduleFormStyles.inputShell}>
      <TextInput
        outlineStyle={[
          globalStyles.outlineStyle,
          !isCardNumberPlausible ? { borderColor: theme.colors.error } : null,
        ]}
        style={[globalStyles.textInputStyle, moduleFormStyles.input]}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={numberVisible ? (card.number ?? "") : maskCardNumber(card.number ?? "")}
        placeholder={t("modules:creditCardNumber")}
        mode="outlined"
        onChangeText={changeCardNumber}
        onFocus={() => setNumberVisible(true)}
        autoCapitalize="none"
        keyboardType="number-pad"
        right={
          <TextInput.Icon
            icon={numberVisible ? "eye-off" : "eye"}
            onPress={() => setNumberVisible((current) => !current)}
          />
        }
      />
    </View>
  );

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:creditCard")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.CREDIT_CARD]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
          {numberInput}
          <CopyToClipboard
            value={cardNumberDigits}
            disabled={!cardNumberDigits}
            kind="password"
            sensitive
          />
        </View>
        <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
          {input(
            "cardholderName",
            t("modules:creditCardHolder"),
            Object.values(card).every((value) => !value),
          )}
          <CopyToClipboard
            value={card.cardholderName ?? ""}
            disabled={!card.cardholderName}
          />
          {input(
            "securityCode",
            t("modules:creditCardSecurityCode"),
            false,
            "number-pad",
          )}
          <CopyToClipboard
            value={card.securityCode ?? ""}
            disabled={!card.securityCode}
            kind="password"
            sensitive
          />
        </View>
        {!isCardNumberPlausible ? (
          <View style={{ paddingHorizontal: 6 }}>
            <Button
              compact
              mode="text"
              icon="alert-circle-outline"
              textColor={theme.colors.error}
              style={{ alignSelf: "flex-start", borderRadius: 12 }}
              labelStyle={{ fontSize: 12 }}
            >
              {t("modules:creditCardNumberInvalid")}
            </Button>
          </View>
        ) : null}

        {expanded ? (
          <>
            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("brand", t("modules:creditCardBrand"))}
              {input("bankName", t("modules:creditCardBank"))}
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input(
                "expiryMonth",
                t("modules:creditCardExpiryMonth"),
                false,
                "number-pad",
              )}
              {input(
                "expiryYear",
                t("modules:creditCardExpiryYear"),
                false,
                "number-pad",
              )}
            </View>

            <View style={globalStyles.moduleView}>
              {input("note", t("modules:creditCardNote"))}
            </View>
          </>
        ) : null}

        <View style={{ alignItems: "center" }}>
          <Button
            compact
            icon={expanded ? "chevron-up" : "chevron-down"}
            mode="text"
            onPress={() => setExpanded((current) => !current)}
            style={{ borderRadius: 12 }}
            labelStyle={{ fontSize: 12 }}
          >
            {expanded
              ? t("modules:creditCardShowLess")
              : t("modules:creditCardShowMore")}
          </Button>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default CreditCardModule;
