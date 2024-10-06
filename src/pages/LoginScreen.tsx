import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import Button from "../components/buttons/Button";
import TypeWriterComponent from "../components/TypeWriter";
import AnimatedContainer from "../components/containers/AnimatedContainer";
import ContentProtection from "../components/ContentProtection";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import Auth from "../components/Auth";
import UserInfoType from "../types/UserInfoType";

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
  const auth = useAuth();
  const { token, tokenType } = useToken();

  const [userInfo, setUserInfo] = useState<UserInfoType>(null);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token, tokenType, setUserInfo);
    }
  }, [token]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedContainer>
        <ContentProtection enabled={false} />
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          {token ? (
            <>
              {userInfo ? (
                <TypeWriterComponent displayName={userInfo.username} />
              ) : null}
              <Button
                text={"Login"}
                onPress={() => auth.login("1234")}
              ></Button>
            </>
          ) : (
            <View style={styles.container}>
              <Auth navigation={navigation} />
            </View>
          )}
        </View>
      </AnimatedContainer>
    </View>
  );
}

export default LoginScreen;
