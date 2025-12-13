import Papa from "papaparse";
import ValuesType, { ValuesListType } from "../../../vault/model/ValuesType";
import { getDateTime } from "../../../../shared/utils/Timestamp";
import createUniqueID from "../../../../shared/utils/createUniqueID";
import getModuleData from "../../../vault/utils/getModuleData";
import ModulesEnum from "../../../vault/model/ModulesEnum";
import { logger } from "../../../../infrastructure/logging/logger";

export default (fileData: string) => {
    const parsedData: any = Papa.parse(fileData);
    if (parsedData.errors.length > 0) {
      logger.error("Error parsing CSV:", parsedData.errors);
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
          folder: null,
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