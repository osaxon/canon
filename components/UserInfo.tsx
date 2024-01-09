import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

interface UserInfoProps {
  userId: any;
}

const UserInfo: React.FC<UserInfoProps> = ({ userId }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean | false>(false);
  const [followed, setFollowed] = useState<boolean | false>(false);

  const sessionUserId = session?.user?.id || "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function fetchFollowCount() {
    if (!userId) {
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("follower_count")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching follower count: ", fetchError);
        return;
      } else if (data) {
        setFollowerCount(data.follower_count);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    fetchFollowCount();
  }, [userId]);

  async function increaseFollowCount() {
    if (!userId) {
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("follower_count")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching follower count: ", fetchError);
        return;
      }

      const newFollowerCount = (data.follower_count || 0) + 1;
      setFollowerCount(newFollowerCount);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ follower_count: newFollowerCount })
        .eq("id", userId);

      if (updateError) {
        console.error("Error: ", updateError);
      } else {
        console.log("Follower count updated successfully");
      }
    } catch (error) {
      console.error("Error: ", error);
    }

    try {
      const { error } = await supabase
        .from("following")
        .insert({ profile_id: sessionUserId, following_profile_id: userId });

      setFollowed(true);

      if (error) {
        console.error("Error following user: ", error);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function decreaseFollowCount() {
    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("follower_count")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching follower count: ", fetchError);
        return;
      }

      const newFollowerCount = Math.max((data.follower_count || 0) - 1, 0);
      setFollowerCount(newFollowerCount);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ follower_count: newFollowerCount })
        .eq("id", userId);

      if (updateError) {
        console.error("Error: ", updateError);
      } else {
        console.log("Follower count updated successfully");
      }
    } catch (error) {
      console.error("Error: ", error);
    }

    try {
      const { error } = await supabase
        .from("following")
        .delete()
        .eq("profile_id", sessionUserId)
        .eq("following_profile_id", userId);

      if (error) {
        console.error("Error following user: ", error);
      } else {
        setFollowed(false);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    const ownProfile = userId === session?.user.id;
    setIsOwnProfile(ownProfile);
  }, [userId, session?.user.id]);

  async function getFollowed() {
    try {
      const {data, error} = await supabase 
      .from("following")
      .select("profile_id, following_profile_id")
      .eq("profile_id", sessionUserId)

      if (error) {
        console.error("Error with getting data: ", error)
      } else {
        console.log(data)
      }
    } catch (error) {
      console.error("Error getting follows: ", error)
    }
  }

  return (
    <>
      <View style={styles.userInfoText}>
        <Text>{followerCount}</Text>
        <Text>Followers</Text>
      </View>
      <View style={styles.userInfoSection}>
        {/* <Text style={styles.userInfoText}>Story Additions</Text>
          <Text style={styles.userInfoText}>Story Creations</Text> */}
        {!isOwnProfile ? (
          !followed ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => increaseFollowCount()}
            >
              <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.followedButton}
              onPress={() => decreaseFollowCount()}
            >
              <Text style={styles.buttonText}>Unfollow</Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
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
  followedButton: {
    backgroundColor: "grey",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  userInfoSection: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  userInfoText: {
    margin: 3,
    display: "flex",
    alignItems: "center",
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
