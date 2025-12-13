import { Animated, View } from "react-native";

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useOnline } from "../../../app/providers/OnlineProvider";
import { useData } from "../../../app/providers/DataProvider";
import { useToken } from "../../../app/providers/CloudProvider";
import { getDateTime } from "../../../shared/utils/Timestamp";
import { encrypt } from "../../../infrastructure/crypto/CryptoLayer";
import { uploadRemoteVaultFile } from "../../../infrastructure/clients/CloudStorageClient";
import { logger } from "../../../infrastructure/logging/logger";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";

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
    props.setRefreshing(true);
    const lastUpdated = getDateTime();
    const encryptedData = await encrypt(
      data.data,
      auth.master ? auth.master : "",
      lastUpdated
    );

    uploadRemoteVaultFile({
      provider,
      accessToken: accessToken ?? "",
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
                          color: "white",
                          userSelect: "none",
                        }}
                      >
                        {t("common:reload")}
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
