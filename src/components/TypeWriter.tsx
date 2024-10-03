import { useState } from "react";
import { View } from "react-native";
import TypeWriter from "react-native-typewriter";
import theme from "../ui/theme";

type Props = {
  displayName: string;
}

function TypeWriterComponent(props: Props) {
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
        style={{ fontSize: 24, userSelect: "none" }}
        minDelay={50}
        typing={1}
        onTypingEnd={() => setStartUsername(1)}
      >
        {"Hello, "}
      </TypeWriter>
      <TypeWriter
        style={[
          { fontSize: 24, userSelect: "none" },
          { color: theme.colors.primary, fontWeight: "bold" },
        ]}
        minDelay={50}
        typing={startUsername}
        onTypingEnd={() => setStartExclamationMark(1)}
      >
        {props.displayName}
      </TypeWriter>
      <TypeWriter
        style={{ fontSize: 24, userSelect: "none" }}
        minDelay={50}
        typing={startExclamationMark}
      >
        {"!"}
      </TypeWriter>
    </View>
  );
}

export default TypeWriterComponent;
