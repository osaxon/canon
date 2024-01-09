import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import { StackParams } from "../App";
import { timeAgo } from "../utils/timeFunctions";
import { Tables } from "../types/database";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const styles = StyleSheet.create({
  image: {
    maxWidth: "100%",
    width: 1000,
    maxHeight: "100%",
    height: "auto",
    borderRadius: 10,
    aspectRatio: 1,
  },
  text: {
    margin: 0,
    marginLeft: 5,
    padding: 0,
    textAlign: "center",
    maxWidth: "100%",
  },
  storyCard: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    aspectRatio: 1,
    minWidth: "50%",
    width: "100%",
    maxWidth: 500,
    height: "auto",
    maxheight: "100%",
    marginTop: 45,
    marginBottom: 50,
    margin: "auto",
  },
  avatarMetadataBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
  },
  MetadataBox: {
    backgroundColor: "lightgrey",
    borderColor: "silver",
    borderStyle: "solid",
    borderWidth:1,
    borderRadius: 10,
    marginLeft: 5,
    marginTop: 5,
    padding: 5,
    marginRight: "auto",
    width: "100%",
    maxWidth: "82%",
  },
});

interface StoryCardProps extends Tables<"stories"> {
  username: string;
  avatar_url: string;
}

const StoryCard = (props: StoryCardProps) => {
  const {
    id,
    first_image_url,
    created_by,
    username,
    avatar_url,
    created_at,
    comment_count,
    votes,
  } = props;
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  const [storyVotes, setStoryVotes] = useState(votes);
  const [userId, setUserId] = useState(null);
  let commentText = "comments";
  let voteText = "votes";
  if (comment_count === 1) {
    commentText = "comment";
  }
  if (storyVotes === 1) {
    voteText = "vote";
  }

  async function getUserId() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username);

      if (data && data.length > 0) {
        setUserId(data[0].id as any);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    getUserId();
  }, [id]);

  return (
    <>
      <View style={styles.storyCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FullStory", {
              story_id: id,
              setStoryVotes,
              storyVotes: votes,
            })
          }
        >
          <Image style={styles.image} source={{ uri: first_image_url! }} />
        </TouchableOpacity>

        <View style={styles.avatarMetadataBox}>
          <Avatar
            onPress={() =>
              navigation.navigate("UserProfile", {
                user_id: userId,
              })
            }
            size={"medium"}
            rounded
            containerStyle={{
              marginTop: 5,
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: 1,
              marginLeft: 5,
            }}
            source={{
              uri: avatar_url
                ? avatar_url
                : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
          <View style={styles.MetadataBox}>
            <Text style={styles.text}>{`${username} posted ${
              created_at && timeAgo(created_at)
            }`}</Text>
            <Text
              style={styles.text}
            >{`${comment_count} comments, ${votes} votes`}</Text>
          </View>
        </View>
      </View>
    </>
  );
};
export default StoryCard;
