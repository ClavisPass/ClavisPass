import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  searchRef: any;
};

function SearchShortcut(props: Props) {
  useHotkeys("ctrl+f", () => {
    props.searchRef.current.focus();
    console.log("gggg");
  });
  return <></>;
}

export default SearchShortcut;
