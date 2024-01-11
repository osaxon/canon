import React from "react";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { timeAgo } from "../utils/timeFunctions";
import { Avatar, Divider, useTheme } from "@rneui/themed";
import StoryItemVotes from "./StoryItemVotes";

interface StoryItemCardProps {
  storyItemData: {
    id: number;
    story_id: number;
    user_id: number;
    profile_id: number;
    created_at: string | number | Date;
    image_url: string | null;
    comment_count: number | null;
    votes: number | null;
    prompt: string | null;
    profiles: { username: string | null; avatar_url: string | null } | null;
  };
  show: boolean;
}

const StoryItemCard = ({
  storyItemData: {
    id,
    story_id,
    user_id,
    profile_id,
    created_at,
    image_url,
    comment_count,
    votes,
    prompt,
    profiles,
  }, show
}: StoryItemCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const { theme, updateTheme } = useTheme();

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
      marginTop: 5,
      padding: 0,
      textAlign: "left",
      maxWidth: "100%",
    },
    promptText: {
      margin: 0,
      marginLeft: 5,
      padding: 0,
      textAlign: "left",
      maxWidth: "100%",
      marginBottom: 5,
    },
    StoryItemCard: {
      boxSixing: "border-box",
      flex: 1,
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      aspectRatio: 1,
      minWidth: "50%",
      width: "100%",
      maxWidth: 540,
      height: "auto",
      marginTop: 55,
      marginBottom: 100,
      margin: "auto",
    },
    avatarMetadataBox: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
      borderColor: theme.colors?.grey2,
      borderStyle: "solid",
      backgroundColor: theme.colors?.grey4,
      borderWidth: 1,
    },
    metadataVotesBox: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
    },
    votesContainer: {
      padding: 0,
      margin: 5,
      marginLeft: "auto",
      marginRight: "auto",
    },
    metadataBox: {
      marginLeft: 5,
      padding: 5,
      marginRight: "auto",
      width: "100%",
      maxWidth: "82%",
    },
  });
  console.log(profile_id, show, "storyItemCard");
  return ( !show ? null :
    <>
      <View style={styles.StoryItemCard}>
        <Image style={styles.image} source={{ uri: image_url! }} />

        <View style={styles.avatarMetadataBox}>
          <Avatar
            onPress={() =>
              navigation.navigate("UserProfile", { user_id: profile_id })
            }
            size={"medium"}
            rounded
            containerStyle={{
              borderColor: "slategrey",
              borderStyle: "solid",
              borderWidth: 2,
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 5,
              backgroundColor: "white",
            }}
            source={{
              uri: profiles?.avatar_url
                ? profiles?.avatar_url
                : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
          <View style={styles.metadataBox}>
            <Text style={styles.promptText}>{`"${prompt}" show: ${show}`}</Text>
            <Divider />
            <View style={styles.metadataVotesBox}>
              <Text style={styles.text}>{`${
                profiles?.username
              } posted ${timeAgo(created_at)}`}</Text>
              <Divider />
              <View style={styles.votesContainer}>
                <StoryItemVotes story_item_id={id} story_item_votes={votes} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default StoryItemCard;
