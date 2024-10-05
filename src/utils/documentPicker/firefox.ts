import Papa from "papaparse";
import { getDateTime } from "../Timestamp";
import ValuesType, { ValuesListType } from "../../types/ValuesType";
import createUniqueID from "../createUniqueID";
import getModuleData from "../getModuleData";
import ModulesEnum from "../../enums/ModulesEnum";

export default (fileData: string) => {
    const parsedData: any = Papa.parse(fileData);
    if (parsedData.errors.length > 0) {
      console.error("Error parsing CSV:", parsedData.errors);
    } else {
      const data = parsedData.data;
      const dateTime = getDateTime();
      let allValues: ValuesListType = [];
      for (var i = 2; i < data.length; i++) {
        const current = data[i];
        let value: ValuesType = {
          id: createUniqueID(),
          title: current[1],
          modules: [],
          folder: "",
          fav: false,
          created: dateTime,
          lastUpdated: dateTime,
        };
        let url = getModuleData(ModulesEnum.URL);
        let username = getModuleData(ModulesEnum.USERNAME);
        let password = getModuleData(ModulesEnum.PASSWORD);
        if (url && username && password) {
          if (current[0]) {
            url.value = current[0];
          }
          if (current[1]) {
            username.value = current[1];
          }
          if (current[2]) {
            password.value = current[2];
          }
          value.modules = [username, password, url];
        }
        allValues = [...allValues, value];
      }
      return allValues;
    }
  };