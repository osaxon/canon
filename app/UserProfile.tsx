import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import { StackParams } from "../App";
import React from "react";
import ProfilePic from "../components/ProfilePic";
import UserInfo from "../components/UserInfo";
import LatestStories from "../components/LatestStories";


type Props = NativeStackScreenProps<StackParams, "UserProfile">;

const UserProfile: React.FC<Props> = ({ route }) => {
  const { user_id } = route.params as { user_id: any };

  return (
    <>
      <View style={styles.container}>
        <ProfilePic userId={user_id} />
        <UserInfo userId={user_id} />
        <LatestStories userId={user_id} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 15,
  },
});

export default UserProfile;
