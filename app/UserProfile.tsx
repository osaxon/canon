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
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 15,
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#333",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0095f6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  userInfoSection: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 18,
    color: "#333",
    margin: 3,
  },
  stories: {
    width: 122,
    height: 122,
    borderRadius: 3,
    borderColor: "#333",
    borderWidth: 1,
    margin: 0,
  },
  scrollView: {
    width: "100%",
    marginTop: 10,
  },
  storyContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#262626",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
  },
});

export default UserProfile;
