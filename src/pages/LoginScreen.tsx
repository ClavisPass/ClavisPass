import React, { useEffect, useRef, useState } from "react";
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
  const { token, tokenType } = useToken();

  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const [loading, setLoading] = useState(true);

  const [editTokenVisibility, setEditTokenVisibility] = useState(false);

  const fetchAsync = async (
    token: string,
    tokenType: "Dropbox" | "GoogleDrive"
  ) => {
    console.log("fetchAsync");
    setLoading(true);
    fetchUserInfo(token, tokenType, setUserInfo, () => {
      console.log("CALLBACK");
      setLoading(false);
    });
  };

  const asyncFetch = async (
    token: string | null,
    tokenType: "Dropbox" | "GoogleDrive" | null
  ) => {
    console.log("asyncFetch");
    if (token && tokenType) {
      setLoading(true);
      fetchAsync(token, tokenType);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) asyncFetch(token, tokenType);
    else setLoading(false);
  }, [token, tokenType]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedContainer>
        <ContentProtection enabled={false} />
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          {loading ? (
            <ActivityIndicator animating={true} />
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
