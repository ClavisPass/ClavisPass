import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AnimatedContainer from "../components/container/AnimatedContainer";
import ContentProtection from "../components/ContentProtection";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import Auth from "../components/Auth";
import UserInfoType from "../types/UserInfoType";
import EditTokenModal from "../components/modals/EditTokenModal";
import { ActivityIndicator } from "react-native-paper";
import Login from "../components/Login";
import generateNewToken from "../api/generateNewToken";
import { Text } from "react-native-paper";
import { useOnline } from "../contexts/OnlineProvider";
import { useTheme } from "../contexts/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const styles = StyleSheet.create({
  container: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: 6,
  },
});

function LoginScreen({ navigation }: { navigation: any }) {
  const { setToken, setRefreshToken, loadRefreshToken, tokenType } = useToken();
  const { isOnline } = useOnline();
  const { headerWhite, setHeaderWhite, darkmode } = useTheme();

  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const [loading, setLoading] = useState(true);

  const [editTokenVisibility, setEditTokenVisibility] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderWhite(false);
    }, [])
  );

  const login = async () => {
    try {
      const refreshToken = await loadRefreshToken();
      if (refreshToken === null || refreshToken === "") {
        setLoading(false);
        return;
      }

      const accessToken = await generateNewToken(refreshToken).then((data) => {
        return data.accessToken;
      });
      if (accessToken === null) {
        setLoading(false);
        return;
      }

      //const tokenType = await checkTokenType(refreshToken);
      setToken(accessToken);
      //setTokenType(tokenType);
      setRefreshToken(refreshToken);
      fetchUserInfo(accessToken, tokenType, setUserInfo, () => {
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    console.log("isOnline:", isOnline);
  }, [isOnline]);

  if (!isOnline) {
    return <Text>OFFLINE</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedContainer>
        <StatusBar animated={true} style={headerWhite ? "light" : darkmode ? "light" : "dark"} translucent={true} />
        <ContentProtection enabled={false} />
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          {loading ? (
            <ActivityIndicator size={"large"} animating={true} />
          ) : userInfo ? (
            <Login userInfo={userInfo} />
          ) : (
            <View style={styles.container}>
              <Auth
                setUserInfo={setUserInfo}
                navigation={navigation}
                changeEditTokenVisibility={setEditTokenVisibility}
              />
              <EditTokenModal
                visible={editTokenVisibility}
                setVisible={setEditTokenVisibility}
              />
            </View>
          )}
        </View>
      </AnimatedContainer>
    </View>
  );
}

export default LoginScreen;
