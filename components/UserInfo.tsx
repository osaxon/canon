import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import Following from "./Following";
import Followers from "./Followers";
import { Overlay } from "react-native-elements";

interface UserInfoProps {
  userId: any;
}

const UserInfo: React.FC<UserInfoProps> = ({ userId }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean | false>(false);
  const [followed, setFollowed] = useState<boolean | false>(false);
  const [isFollowingVisible, setFollowingVisible] = useState<boolean | false>(
    false
  );
  const [isFollowerVisible, setFollowerVisible] = useState<boolean | false>(
    false
  );

  const sessionUserId = session?.user?.id || "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function increaseFollowCount() {
    if (!userId) {
      return;
    }

    try {
      const { error: followError } = await supabase
        .from("following")
        .insert({ profile_id: sessionUserId, following_profile_id: userId });

      if (followError) {
        console.error("Error following user: ", followError);
      }

      const { error: followerError } = await supabase
        .from("followers")
        .insert({ profile_id: userId, follower_profile_id: sessionUserId });

      if (followerError) throw followerError;

      await getFollowingInfo();
      await getFollowersInfo();
      setFollowed(true);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function decreaseFollowCount() {
    try {
      const { error: unfollowError } = await supabase
        .from("following")
        .delete()
        .eq("profile_id", sessionUserId)
        .eq("following_profile_id", userId);

      if (unfollowError) {
        console.error("Error following user: ", unfollowError);
      }

      const { error: followerError } = await supabase
        .from("followers")
        .delete()
        .eq("profile_id", userId)
        .eq("follower_profile_id", sessionUserId);

      if (followerError) throw followerError;

      setFollowed(false);
      await getFollowingInfo();
      await getFollowersInfo();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    const ownProfile = userId === session?.user.id;
    setIsOwnProfile(ownProfile);
  }, [userId, sessionUserId]);

  async function getFollowingInfo() {
    if (!sessionUserId || !userId) {
      return;
    }

    try {
      const response = await supabase
        .from("following")
        .select("profile_id, following_profile_id", { count: "exact" })
        .eq("profile_id", userId);

      if (response.error) {
        console.error("Error with getting data: ", response.error);
        return;
      }

      setFollowingCount(response.count);
    } catch (error) {
      console.error("Error getting follows: ", error);
    }
  }

  async function getFollowersInfo() {
    if (!sessionUserId) {
      return;
    }

    try {
      const response = await supabase
        .from("followers")
        .select("profile_id, follower_profile_id", { count: "exact" })
        .eq("profile_id", userId);

      if (response.error) {
        console.log("Error with getting data: ", response.error);
        return;
      }

      setFollowerCount(response.count);
    } catch (error) {
      console.error("Error getting follows: ", error);
    }
  }

  async function handleSetFollowed() {
    if (!sessionUserId || !userId) {
      return;
    }

    try {
      const {data, error} = await supabase
        .from("following")
        .select("profile_id, following_profile_id")
        .eq("profile_id", sessionUserId);

      if (error) {
        console.error("Error with getting data: ", error);
        return;
      }

      const isFollowing = data.some(
        (record) => record.following_profile_id === userId
      );
      setFollowed(isFollowing);
    } catch (error) {
      console.error("Error getting follows: ", error);
    }
  }

  useEffect(() => {
    getFollowersInfo();
    getFollowingInfo();
    handleSetFollowed();
  }, [sessionUserId, userId]);

  const hideFollowingOverlay = () => {
    setFollowingVisible(false);
  };

  const hideFollowerOverlay = () => {
    setFollowerVisible(false);
  };

  return (
    <>
      <Overlay
        isVisible={isFollowingVisible}
        onBackdropPress={() => setFollowingVisible(false)}
        overlayStyle={{ width: "90%", height: "80%" }}
      >
        <Following
          onHideOverlay={hideFollowingOverlay}
          userId={userId}
          sessionUserId={sessionUserId}
        />
      </Overlay>
      <Overlay
        isVisible={isFollowerVisible}
        onBackdropPress={() => setFollowerVisible(false)}
        overlayStyle={{ width: "90%", height: "80%" }}
      >
        <Followers
          onHideOverlay={hideFollowerOverlay}
          userId={userId}
          sessionUserId={sessionUserId}
        />
      </Overlay>
      <View style={styles.userInfoSection}>
        <TouchableOpacity onPress={() => setFollowingVisible(true)}>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoDigit}>{followingCount}</Text>
            <Text style={styles.userInfoDes}>Following</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFollowerVisible(true)}>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoDigit}>{followerCount}</Text>
            <Text style={styles.userInfoDes}>Followers</Text>
          </View>
        </TouchableOpacity>
        {!isOwnProfile ? (
          !followed ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                increaseFollowCount();
              }}
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
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  userInfoDigit: {
    fontWeight: "bold",
  },
  userInfoDes: {
    fontWeight: "200",
  },
  userInfo: {
    margin: 10,
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
