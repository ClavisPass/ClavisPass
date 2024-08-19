import Papa from "papaparse";
import ValuesType, { ValuesListType } from "../../types/ValuesType";
import { getDateTime } from "../../utils/Timestamp";
import createUniqueID from "../../utils/createUniqueID";
import getModuleData from "../../utils/getModuleData";
import ModulesEnum from "../../enums/ModulesEnum";

export default (fileData: string) => {
    const parsedData: any = Papa.parse(fileData);
    if (parsedData.errors.length > 0) {
      console.error("Error parsing CSV:", parsedData.errors);
    } else {
      const data = parsedData.data;
      const dateTime = getDateTime();
      let allValues: ValuesListType = [];
      for (var i = 1; i < data.length; i++) {
        const current = data[i];
        let value: ValuesType = {
          id: createUniqueID(),
          title: current[0],
          modules: [],
          folder: "",
          fav: false,
          created: dateTime,
          lastUpdated: dateTime,
        };
        let url = getModuleData(ModulesEnum.URL);
        let username = getModuleData(ModulesEnum.USERNAME);
        let password = getModuleData(ModulesEnum.PASSWORD);
        let note = getModuleData(ModulesEnum.NOTE);
        if (url && username && password && note) {
          if (current[1]) {
            url.value = current[1];
          }
          if (current[2]) {
            username.value = current[2];
          }
          if (current[3]) {
            password.value = current[3];
          }
          value.modules = [username, password, url];
          if (current[4] && current[4] !== "") {
            note.value = current[4];
            value.modules = [...value.modules, note];
          }
        }
        allValues = [...allValues, value];
      }
      return allValues;
    }
  };