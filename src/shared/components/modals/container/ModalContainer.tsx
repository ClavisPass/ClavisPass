import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal as NativeModal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "../../../../app/providers/ThemeProvider";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  avoidKeyboard?: boolean;
};

const ModalContainer = ({
  visible,
  onDismiss,
  children,
  avoidKeyboard = true,
}: Props) => {
  const { darkmode } = useTheme();
  const backdropColor = darkmode
    ? "rgba(0, 0, 0, 0.54)"
    : "rgba(22, 28, 45, 0.22)";
  const { height } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardInset = avoidKeyboard ? keyboardHeight : 0;
  const maxContentHeight = Math.max(120, height - keyboardInset - 40);

  useEffect(() => {
    if (!visible || !avoidKeyboard) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [avoidKeyboard, visible]);

  return (
    <NativeModal
      visible={visible}
      onRequestClose={onDismiss}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          onPress={onDismiss}
          style={[styles.backdrop, { backgroundColor: backdropColor }]}
        />
        <KeyboardAvoidingView
          enabled={avoidKeyboard}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={24}
          pointerEvents="box-none"
          style={[
            styles.contentLayer,
            { paddingBottom: keyboardInset + 20 },
          ]}
        >
          <View
            onStartShouldSetResponder={() => true}
            style={[styles.contentHitbox, { maxHeight: maxContentHeight }]}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </NativeModal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  contentLayer: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHitbox: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

export default ModalContainer;
