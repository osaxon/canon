import React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";

type FollowerProps = {
  userId: any;
  onHideOverlay: () => void;
  sessionUserId: any;
};

// interface Follower {
//   follower_profile_id: string;
// }

interface Profile {
  id: any;
  username: string;
  full_name: string;
  avatar_url: string;
}

const Followers: React.FC<FollowerProps> = ({ onHideOverlay, userId }) => {
  const [followerIds, setFollowerIds] = useState<string[]>([]);
  const [followerProfiles, setFollowerProfiles] = useState<Profile[]>([]);

  async function getFollowers() {
    try {
      const { data, error } = await supabase
        .from("followers")
        .select("follower_profile_id")
        .eq("profile_id", userId);

      if (error) {
        console.error(error);
      } else {
        const ids = data.map((item) => item.follower_profile_id);
        setFollowerIds(ids);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getFollowers();
  }, [userId]);

  async function getUserInfo(ids: string[]) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);

      if (error) {
        console.error(error);
      } else {
        setFollowerProfiles(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (followerIds.length > 0) {
      getUserInfo(followerIds);
    }
  }, [followerIds]);

  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const handleUserPress = (userId: any) => {
    onHideOverlay();
    setTimeout(() => {
      navigation.navigate("UserProfile", { user_id: userId });
    }, 0);
  };

  return (
    <FlatList
      data={followerProfiles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => handleUserPress(item.id)}
        >
          <View>
            <Avatar rounded source={{ uri: item.avatar_url }} size="large" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.fullName}>{item.full_name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default Followers;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    padding: 5,
    backgroundColor: "#FFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0,
  },
  textContainer: {
    marginLeft: 15,
    justifyContent: "center",
  },
  username: {
    fontWeight: "bold",
  },
  fullName: {
    color: "gray",
  },
});