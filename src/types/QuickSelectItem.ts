import { View } from "react-native";

type QuickSelectItem = {
  title: string;
  icon: string;
  ref: React.RefObject<View | null>;
};

export default QuickSelectItem;
