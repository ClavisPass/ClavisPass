import React, { useCallback, useEffect, useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/model/types";

import { Icon, TextInput } from "react-native-paper";
import ValuesType from "../../model/ValuesType";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { Platform, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
  value: ValuesType;
  changeTitle: (title: string) => void;
  initialTitle: string | null;
  onFocus?: () => void;
  onBlur?: () => void;
};

function TitleModule(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList, "Edit">>();

  const textInputRef = useRef<any>(null);
  const shouldFocusTitle = useRef(props.value.title === "").current;
  const didFocusTitle = useRef(false);

  const changeTitle = (text: string) => {
    props.changeTitle(text);
  };

  useEffect(() => {
    if (textInputRef.current && props.value.title === "") {
      if (props.initialTitle !== null) {
        changeTitle(props.initialTitle);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!shouldFocusTitle || didFocusTitle.current) return;

      const focusTitle = () => {
        if (didFocusTitle.current || !textInputRef.current) return;
        textInputRef.current.focus();
        didFocusTitle.current = true;
      };

      if (Platform.OS === "web") {
        focusTitle();
        return;
      }

      // Native stack transitions can dismiss a keyboard opened during mount.
      const unsubscribe = navigation.addListener("transitionEnd", (event) => {
        if (!event.data.closing) focusTitle();
      });
      // Also handle entry without an animated transition.
      const fallback = setTimeout(focusTitle, 500);

      return () => {
        unsubscribe();
        clearTimeout(fallback);
      };
    }, [navigation, shouldFocusTitle]),
  );

  return (
    <View
      {...(Platform.OS === "web"
        ? ({ className: "clavispass-cursor-text" } as any)
        : null)}
      style={{
        height: 34,
        width: 200,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        ref={textInputRef}
        {...(Platform.OS === "web"
          ? ({ className: "clavispass-cursor-text" } as any)
          : null)}
        placeholder={`${t("modules:title")}...`}
        placeholderTextColor={"lightgrey"}
        outlineStyle={[
          {
            borderWidth: 0,
            height: 34,
            borderRadius: 0,
            width: "100%",
            borderColor:
              props.value.title == ""
                ? theme.colors?.error
                : theme.colors?.primary,
            borderBottomWidth: 1,
            padding: 0,
            margin: 0,
            maxWidth: 200,
          },
        ]}
        contentStyle={[
          {
            margin: 0,
            padding: 0,
            height: 34,
            backgroundColor: "transparent",
          },
          Platform.OS === "web" ? ({ cursor: "text" } as any) : null,
        ]}
        underlineStyle={{ margin: 0, padding: 0 }}
        style={[
          {
            flex: 1,
            width: "100%",
            margin: 0,
            padding: 0,
            height: 34,
            backgroundColor: "transparent",
          },
          Platform.OS === "web" ? ({ cursor: "text" } as any) : null,
        ]}
        value={props.value.title}
        mode="outlined"
        onChangeText={(text) => changeTitle(text)}
        right={
          props.value.title == "" && (
            <TextInput.Icon
              icon="alert-circle"
              size={20}
              color={theme.colors?.error}
            />
          )
        }
      />
    </View>
  );
}

export default TitleModule;
