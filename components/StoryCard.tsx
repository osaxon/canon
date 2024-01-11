import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "@rneui/themed";
import { StackParams } from "../App";
import { supabase } from "../lib/supabase";
import { Tables } from "../types/database";
import { timeAgo } from "../utils/timeFunctions";
import { useTheme } from "@rneui/themed";



interface StoryCardProps extends Tables<"stories"> {
    username: string;
    avatar_url: string;
}

const StoryCard = (props: StoryCardProps) => {
  const { theme, updateTheme } = useTheme()

  const styles = StyleSheet.create({
    image: {
      maxWidth: "100%",
      width: 1080,
      maxHeight: "100%",
      height: "auto",
      aspectRatio: 1,
    },
    text: {
      margin: 0,
      marginLeft: 5,
      padding: 0,
      textAlign: "left",
      maxWidth: "100%",
    },
    storyCard: {
      boxSixing: "border-box",
      flex:1,
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      aspectRatio: 1,
      minWidth: "50%",
      width: "100%",
      maxWidth: 540,
      height: "auto",
      maxheight: "100%",
      marginTop: 45,
      marginBottom: 70,
      margin: "auto",
    },
    avatarMetadataBox: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
      borderColor: theme.colors?.grey2,
      borderStyle: "solid",
      borderWidth:1,
      backgroundColor: theme.colors?.grey4,
    },
    MetadataBox: {
      marginLeft: 5,
      padding: 5,
      marginRight: "auto",
      width: "100%",
      maxWidth: "82%",
      display: "flex",
      // justifyContent: "flex-start",
      alignItems: "flex-start",
    },
  });
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
              votes: votes
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
              borderColor: "slategrey",
              borderStyle: "solid",
              borderWidth: 2,
              marginTop:5,
              marginBottom:5,
              marginLeft:5,
              backgroundColor:"white",
            }}
            source={{
              uri: avatar_url
                ? avatar_url
                : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
          <View style={styles.MetadataBox}>
            <Text style={styles.text}>{`${username} posted ${created_at && timeAgo(created_at)}`}</Text>
            <Text style={styles.text}>{`${comment_count} ${commentText}: ${votes} ${voteText}`}</Text>
          </View>
        </View>
      </View>
    </>
  );
};
export default StoryCard;
