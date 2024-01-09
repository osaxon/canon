import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import { timeAgo } from "../utils/timeFunctions";
import { useEffect, useState } from "react";
import { StoriesStackParams } from "../screens/StoriesScreens";

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
        border: "solid 1px silver",
        borderRadius: 10,
        marginLeft: 5,
        marginTop: 5,
        padding: 5,
        marginRight: "auto",
        width: "100%",
        maxWidth: "82%",
    },
});

interface StoryCardProps {
    storyData: {
        id: number;
        story_id: number;
        profile_id: number;
        created_at: string | number | Date;
        image_url: string | null;
        comment_count: number | null;
        votes: number;
        profiles: { username: string | null; avatar_url: string | null } | null;
        stories : { votes: number | null; comment_count: number | null; story_comments: [] | undefined}
    };
}

const StoryCard = ({
    storyData: {
        id,
        story_id,
        profile_id,
        created_at,
        image_url,
        comment_count,
        votes,
        profiles,
        stories
    },
}: StoryCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<StoriesStackParams>>();
  const [storyVotes, setStoryVotes] = useState(stories.votes);
  let commentText = "comments"
  let voteText = "votes"
  if(comment_count === 1){ commentText="comment"}
  if(storyVotes === 1){ voteText="vote"}
  return (
    <>
      <View style={styles.storyCard}>
        <TouchableOpacity onPress={() => navigation.navigate("FullStory", { story_id, storyVotes, setStoryVotes})}>
          <Image style={styles.image} source={{ uri: image_url! }} />
        </TouchableOpacity>

        <View style={styles.avatarMetadataBox}>
          <Avatar
          onPress={() => navigation.navigate("UserProfile", { user_id: profile_id })}
            size={"medium"}
            rounded
            containerStyle={{
              marginTop: 5,
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: 1,
              marginLeft:5,
            }}
            source={{
              uri: profiles?.avatar_url
                ? profiles?.avatar_url
                : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
          <View style={styles.MetadataBox}>
            <Text style={styles.text}>{`${profiles?.username} posted ${timeAgo(created_at)}`}</Text>
            <Text style={styles.text}>{`${comment_count} ${commentText}, ${storyVotes} ${voteText}`}</Text>
          </View>
        </View>
      </View>
    </>
  );
};
export default StoryCard;
