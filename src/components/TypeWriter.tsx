import { useMemo, useState } from "react";
import { View } from "react-native";
import TypeWriter from "react-native-typewriter";
import { useTheme } from "../contexts/ThemeProvider";

type Props = {
  displayName: string;
  height?: number;
};

function TypeWriterComponent(props: Props) {
  const { theme } = useTheme();
  const [startUsername, setStartUsername] = useState<-1 | 0 | 1>(0);
  const [startExclamationMark, setStartExclamationMark] = useState<-1 | 0 | 1>(
    0
  );

  const greetings = [
    "Hi, ",
    "Hey, ",
    "Hello, ",
    "What's up, ",
    "Yo, ",
    "Welcome, ",
    "Good to see you, ",
    "Sup, ",
    "Yo yo, ",
    "Hey there, ",
    "What's good, ",
    "Alright, ",
    "Oii, ",
    "Long time no see, ",
    "Wassup, ",
    "Yo fam, ",
    "Hey bud, ",
    "Ayo, ",
    "Hey dude, ",
    "Yo chief, ",
  ];

  const randomGreeting = useMemo(() => {
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        overflow: "visible",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        minHeight: 28,
        height: props.height ? props.height : undefined,
      }}
    >
      <TypeWriter
        style={{
          fontSize: 20,
          userSelect: "none",
          color: theme.colors.onSurface,
        }}
        minDelay={50}
        typing={1}
        onTypingEnd={() => setStartUsername(1)}
      >
        {randomGreeting}
      </TypeWriter>
      <TypeWriter
        style={[
          { fontSize: 20, userSelect: "none" },
          { color: theme.colors.primary, fontWeight: "bold" },
        ]}
        minDelay={50}
        typing={startUsername}
        onTypingEnd={() => setStartExclamationMark(1)}
      >
        {props.displayName}
      </TypeWriter>
      <TypeWriter
        style={{
          fontSize: 20,
          userSelect: "none",
          color: theme.colors.onSurface,
        }}
        minDelay={50}
        typing={startExclamationMark}
      >
        {"!"}
      </TypeWriter>
    </View>
  );
}

export default TypeWriterComponent;
