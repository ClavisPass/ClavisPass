import DataType from "../types/DataType";

function getData() {
  const data: DataType = {
    lastUpdated: "Date",
    master: "1zge12zge12uzge21uzge21uzeg21zueg1uz2gr21iuriu",
    folder: ["wifi"],
    values: [
      {
        modules: [
          { module: "title", value: "TestTitel" },
          { module: "username", value: "TestUsername" },
          { module: "password", value: "TestPassword" },
          { module: "note", value: "Notiz" },
        ],
        fav: true,
        created: "Date",
        lastUpdated: "Date",
        folder: "",
        icon: "password"
      },
      {
        modules: [
          { module: "title", value: "TestTitel" },
          { module: "wifi", value: "2342637423735324", wifiName:"", wifiType:"wpa" },
          { module: "note", value: "Notiz" },
        ],
        fav: true,
        created: "Date",
        lastUpdated: "Date",
        folder: "wifi",
        icon: "wifi"
      },
    ],
  };
  return data;
}
