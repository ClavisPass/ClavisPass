import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

function AddTabButton({ navigation, state, ...props }: any) {
  const isHome = state.routes[state.index].name === "HomeStack";

  return (
    <TouchableOpacity
      {...props}
      onPress={() => {
        navigation.navigate("HomeStack", {
          screen: "Home",
          params: { triggerAdd: Date.now() },
        });
      }}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon source="plus-circle" size={24} color="#6200ee" />
    </TouchableOpacity>
  );
}

export default AddTabButton;
