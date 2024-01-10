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
import { Avatar } from "@rneui/themed";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";

type FollowingProps = {
  userId: any;
  onHideOverlay: () => void;
  sessionUserId: any;
};

interface Following {
  following_profile_id: string;
}

interface Profile {
  id: any;
  username: string;
  full_name: string;
  avatar_url: string;
}

const Following: React.FC<FollowingProps> = ({ onHideOverlay, userId }) => {
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<Profile[]>([]);

  async function getFollowing() {
    try {
      const { data, error } = await supabase
        .from("following")
        .select("following_profile_id")
        .eq("profile_id", userId);

      if (error) {
        console.error(error);
      } else {
        const ids = data.map((item) => item.following_profile_id);
        setFollowingIds(ids);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getFollowing();
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
        console.log(data);
        setFollowingProfiles(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (followingIds.length > 0) {
      getUserInfo(followingIds);
    }
  }, [followingIds]);

  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const handleUserPress = (userId: any) => {
    onHideOverlay();
    setTimeout(() => {
      navigation.navigate("UserProfile", { user_id: userId });
    }, 0);
  };

  return (
    <FlatList
      data={followingProfiles}
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

export default Following;

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
