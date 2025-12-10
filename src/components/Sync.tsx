import { Animated, View } from "react-native";
import AnimatedPressable from "./AnimatedPressable";
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useOnline } from "../contexts/OnlineProvider";
import { useTheme } from "../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { encrypt } from "../utils/CryptoLayer";
import { useData } from "../contexts/DataProvider";
import { getDateTime } from "../utils/Timestamp";
import { useToken } from "../contexts/CloudProvider";
import { uploadRemoteVaultFile } from "../api/CloudStorageClient";
import { logger } from "../utils/logger";

type Props = {
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  refreshData: () => void;
};

const Sync = (props: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const auth = useAuth();
  const { isOnline } = useOnline();
  const data = useData();
  const { accessToken, provider } = useToken();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (data.showSave) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 48,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [data.showSave]);

  const save = async () => {
    if (accessToken === null) {
      logger.error("Cannot save: No access token.");
      return;
    }
    props.setRefreshing(true);
    const lastUpdated = getDateTime();
    const encryptedData = await encrypt(
      data.data,
      auth.master ? auth.master : "",
      lastUpdated
    );

    uploadRemoteVaultFile({
      provider,
      accessToken,
      remotePath: "clavispass.lock",
      content: encryptedData,
      onCompleted: () => {
        logger.info("Remote vault upload completed.");
        data.setShowSave(false);
        props.setRefreshing(false);
      },
    });
  };
  return (
    <Animated.View
      style={{
        height: slideAnim,
        opacity: fadeAnim,
        width: "100%",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      {data.showSave && (
        <View
          style={{
            height: 48,
            width: "100%",
            padding: 4,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {props.refreshing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {isOnline ? (
                  <>
                    <View style={{ backgroundColor: "#00000017" }}>
                      <AnimatedPressable
                        onPress={save}
                        style={{
                          height: 40,
                          width: 130,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          variant="bodyLarge"
                          style={{ color: "white", userSelect: "none" }}
                        >
                          {t("common:save")}
                        </Text>
                      </AnimatedPressable>
                    </View>
                    <AnimatedPressable
                      onPress={props.refreshData}
                      style={{
                        height: 40,
                        width: 130,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Text
                        variant="bodyLarge"
                        style={{
                          textDecorationLine: "underline",
                          color: "white",
                          userSelect: "none",
                        }}
                      >
                        {t("common:reset")}
                      </Text>
                    </AnimatedPressable>
                  </>
                ) : (
                  <Icon source="cloud-off-outline" color="white" size={20} />
                )}
              </>
            )}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default Sync;
