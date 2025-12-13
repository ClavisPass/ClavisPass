import ModulesEnum from "../../../vault/model/ModulesEnum";
import ValuesType, { ValuesListType } from "../../../vault/model/ValuesType";
import createUniqueID from "../../../../shared/utils/createUniqueID";
import getModuleData from "../../../vault/utils/getModuleData";
import { getDateTime } from "../../../../shared/utils/Timestamp";

import CryptoJS from "react-native-crypto-js";

export function decrypt(ciphertext: string, secret: string) {
  try {
    return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8)
  } catch (error) {
    throw new Error("Data can't be parsed! | " + error);
  }
}

export default (fileData: string, secret: string) => {
    const data: any = JSON.parse(fileData);

    const dateTime = getDateTime();
    let allValues: ValuesListType = [];
    for (var i = 1; i < data.length; i++) {
      const current = data[i];
      let value: ValuesType = {
        id: createUniqueID(),
        title: decrypt(current.titel, secret),
        modules: [],
        folder: null,
        fav: false,
        created: dateTime,
        lastUpdated: dateTime,
      };
      let username = getModuleData(ModulesEnum.USERNAME);
      let email = getModuleData(ModulesEnum.E_MAIL);
      let password = getModuleData(ModulesEnum.PASSWORD);
      let key = getModuleData(ModulesEnum.KEY);
      let url = getModuleData(ModulesEnum.URL);
      let note = getModuleData(ModulesEnum.NOTE);
      if (url && username && email && password && key && note) {
        const usernameDecrypted = decrypt(current.username, secret);
        if (usernameDecrypted !== "") {
          username.value = usernameDecrypted;
          value.modules = [...value.modules, username];
        }
        const emailDecrypted = decrypt(current.email, secret);
        if (emailDecrypted !== "") {
          email.value = emailDecrypted;
          value.modules = [...value.modules, email];
        }
        if (parseInt(current.id) > 0) {
          const passwordDecrypted = decrypt(current.password, secret);
          if (passwordDecrypted !== "") {
            password.value = passwordDecrypted;
            value.modules = [...value.modules, password];
          }
        }
        if (parseInt(current.id) < 0) {
          const keyDecrypted = decrypt(current.password, secret);
          if (keyDecrypted !== "") {
            key.value = keyDecrypted;
            value.modules = [...value.modules, key];
          }
        }

        const urlDecrypted = decrypt(current.url, secret);
        if (urlDecrypted !== "") {
          url.value = urlDecrypted;
          value.modules = [...value.modules, url];
        }
        const noteDecrypted = decrypt(current.note, secret);
        if (noteDecrypted !== "") {
          note.value = noteDecrypted;
          value.modules = [...value.modules, note];
        }
      }
      allValues = [...allValues, value];
    }
    return allValues;
  };