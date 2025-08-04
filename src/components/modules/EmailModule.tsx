import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";

import { TextInput } from "react-native-paper";

import EmailModuleType from "../../types/modules/EmailModuleType";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import Autocomplete from "../Autocomplete";
import { useData } from "../../contexts/DataProvider";
import { ValuesListType } from "../../types/ValuesType";
import ModulesEnum from "../../enums/ModulesEnum";
import { ModuleType } from "../../types/ModulesType";
import validateEmail from "../../utils/regex/validateEmail";

function EmailModule(props: EmailModuleType & Props) {
  const didMount = useRef(false);
  const inputRef = useRef<any>(null);

  const data = useData();
  const [isValid, setIsValid] = useState(false);

  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);

  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const [isSuggestionClicked, setIsSuggestionClicked] = React.useState(false);

  const findEmails = () => {
    let cachedEMails: string[] = [];
    const values = data?.data?.values;
    if (values) {
      let cachedData = [...values] as ValuesListType;
      cachedData.forEach((item) => {
        const allEMails = item.modules.filter(
          (module) => module.module === ModulesEnum.E_MAIL
        );
        allEMails.forEach((module: ModuleType) => {
          if (!cachedEMails.includes(module.value))
            cachedEMails.push(module.value);
        });
      });
    }
    return cachedEMails;
  };

  const autocompleteData = findEmails();

  const filteredAutocompleteData = useMemo(() => {
    const data = autocompleteData.filter((item) => {
      const valueLowercase = value.toLowerCase();
      const itemLowercase = item.toLowerCase();
      return itemLowercase.includes(valueLowercase) && item !== value;
    });
    if (Platform.OS === "web") return data;
    return [value, ...data];
  }, [value]);

  useEffect(() => {
    setIsValid(validateEmail(value));
  }, [value]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: EmailModuleType = {
        id: props.id,
        module: props.module,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  const handleBlur = () => {
    if (Platform.OS === "web") {
      setTimeout(() => {
        if (!isSuggestionClicked) {
          setAutocompleteVisible(false);
        }
        setIsSuggestionClicked(false);
      }, 200);
    } else {
      setAutocompleteVisible(false);
      setIsSuggestionClicked(false);
      inputRef.current.blur();
    }
  };

  return (
    <ModuleContainer
      id={props.id}
      title={"E-Mail"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.E_MAIL}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            ref={inputRef}
            onFocus={() => {
              setAutocompleteVisible(true);
            }}
            onBlur={handleBlur}
            blurOnSubmit={false}
            outlineStyle={[
              globalStyles.outlineStyle,
              !isValid ? { borderColor: theme.colors.error } : null,
            ]}
            style={globalStyles.textInputStyle}
            value={value}
            mode="outlined"
            onChangeText={(text) => setValue(text)}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        </View>
        <CopyToClipboard value={value} />
      </View>
      <Autocomplete
        setValue={setValue}
        data={filteredAutocompleteData}
        visible={autocompleteVisible}
        setVisible={setAutocompleteVisible}
        setIsSuggestionClicked={setIsSuggestionClicked}
      />
    </ModuleContainer>
  );
}

export default EmailModule;
