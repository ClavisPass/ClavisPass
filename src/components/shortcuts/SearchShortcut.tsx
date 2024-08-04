import { useEffect } from "react";
import { Platform } from "react-native";

type Props = {
  searchRef: any;
};

function SearchShortcut(props: Props) {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "f") {
          event.preventDefault();
          props.searchRef.current.focus();
        }
      });
    }
  });
  return <></>;
}

export default SearchShortcut;
