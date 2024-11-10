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

  const fetchAsync = async () => {
    if (token) {
      setLoading(true);
      fetchUserInfo(token, tokenType, setUserInfo, () => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAsync();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedContainer>
        <ContentProtection enabled={false} />
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          {!loading ? (
            <>
              {userInfo ? (
                <Login userInfo={userInfo} />
              ) : (
                <>
                  <View style={styles.container}>
                    <Auth
                      setUserInfo={setUserInfo}
                      navigation={navigation}
                      changeEditTokenVisibility={setEditTokenVisibility}
                    />
                  </View>
                  <EditTokenModal
                    visible={editTokenVisibility}
                    setVisible={setEditTokenVisibility}
                  />
                </>
              )}
            </>
          ) : (
            <ActivityIndicator animating={true} />
          )}
        </View>
      </AnimatedContainer>
    </View>
  );
}

export default LoginScreen;
