import Constants from "expo-constants";
import { useState } from "react";
import { View } from "react-native";
import TypeWriter from "react-native-typewriter";
import theme from "../ui/theme";

function TypeWriterComponent() {
  const [startUsername, setStartUsername] = useState<-1 | 0 | 1>(0);
  const [startExclamationMark, setStartExclamationMark] = useState<-1 | 0 | 1>(
    0
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        overflow: "visible",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TypeWriter
        //style={globalStyles.titelAnfang}
        minDelay={50}
        typing={1}
        onTypingEnd={() => setStartUsername(1)}
      >
        {"Hello, "}
      </TypeWriter>
      <TypeWriter
        style={[
          //globalStyles.titelAnfang,
          { color: theme.colors.primary, fontWeight: "bold" },
        ]}
        minDelay={50}
        typing={startUsername}
        onTypingEnd={() => setStartExclamationMark(1)}
      >
        {Constants.deviceName}
      </TypeWriter>
      <TypeWriter
        //style={globalStyles.titelAnfang}
        minDelay={50}
        typing={startExclamationMark}
      >
        {"!"}
      </TypeWriter>
    </View>
  );
}

export default TypeWriterComponent;
