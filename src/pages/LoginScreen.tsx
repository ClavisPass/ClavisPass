import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";
import { BlurView } from "expo-blur";
import Logo from "../ui/Logo";
import Blob1 from "../ui/Blob1";
import Blob2 from "../ui/Blob2";

const styles = StyleSheet.create({
  container: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: 6,
  },
  blob: {
    position: "absolute",
    width: 420,
    height: 420,
    //zIndex: -1,
  },
});

function LoginScreen({ navigation }: { navigation: any }) {
  const { setToken, setRefreshToken, loadRefreshToken, tokenType } = useToken();
  const { isOnline } = useOnline();
  const { headerWhite, setHeaderWhite, darkmode, theme } = useTheme();

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
    <AnimatedContainer>
      <ImageBackground
        source={darkmode?require("../../assets/blurred-bg-dark.png"):require("../../assets/blurred-bg.png")}
        resizeMode="cover"
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            padding: 20,
            backgroundColor: "rgba(255,255,255,0.2)",
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatusBar
            animated={true}
            style={headerWhite ? "light" : darkmode ? "light" : "dark"}
            translucent={true}
          />
          <ContentProtection enabled={false} />
          <BlurView
            intensity={80}
            style={{
              height: "70%",
              borderRadius: 20,
              padding: 20,
              overflow: "hidden",
              //backgroundColor: theme.colors.background,
              margin: 8,
              minWidth: 300,
              display: "flex",
              justifyContent: "center",
              boxShadow: theme.colors.shadow,
            }}
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
          </BlurView>
        </View>
      </ImageBackground>
    </AnimatedContainer>
  );
}

export default LoginScreen;
