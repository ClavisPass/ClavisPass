import { useMemo, useState } from "react";
import { View } from "react-native";
import TypeWriter from "react-native-typewriter";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

type Props = {
  displayName: string;
  height?: number;
};

function TypeWriterComponent(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [startUsername, setStartUsername] = useState<-1 | 0 | 1>(0);
  const [startExclamationMark, setStartExclamationMark] = useState<-1 | 0 | 1>(
    0
  );

  const greetings = [
    t("greetings:1"),
    t("greetings:2"),
    t("greetings:3"),
    t("greetings:4"),
    t("greetings:5"),
    t("greetings:6"),
    t("greetings:7"),
    t("greetings:8"),
    t("greetings:9"),
    t("greetings:10"),
    t("greetings:11"),
    t("greetings:12"),
    t("greetings:13"),
    t("greetings:14"),
    t("greetings:15"),
    t("greetings:16"),
    t("greetings:17"),
    t("greetings:18"),
    t("greetings:19"),
    t("greetings:20"),
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
        minDelay={20}
        typing={1}
        onTypingEnd={() => {
          if (props.displayName == "") {
            setStartExclamationMark(1);
          } else {
            setStartUsername(1);
          }
        }}
      >
        {randomGreeting}
      </TypeWriter>
      {props.displayName !== "" && (
        <TypeWriter
          style={[
            { fontSize: 20, userSelect: "none" },
            { color: theme.colors.primary, fontWeight: "bold" },
          ]}
          minDelay={20}
          typing={startUsername}
          onTypingEnd={() => setStartExclamationMark(1)}
        >
          {` ${props.displayName}`}
        </TypeWriter>
      )}
      <TypeWriter
        style={{
          fontSize: 20,
          userSelect: "none",
          color: theme.colors.onSurface,
        }}
        minDelay={20}
        typing={startExclamationMark}
      >
        {"!"}
      </TypeWriter>
    </View>
  );
}

export default TypeWriterComponent;
