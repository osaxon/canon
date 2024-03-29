import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, useTheme } from "@rneui/themed";
import { Tables } from "../types/database";
import { supabase } from "../lib/supabase";
import { Text, StyleSheet } from "react-native";
import { timeAgo } from "../utils/timeFunctions";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import React from "react";
import AddComment from "../components/AddComment";
import DeleteComment from "./DeleteComment";

type CommentsProps = {
  story_id: number;
};

export interface Comment extends Tables<"story_comments"> {
  profiles: { username: string | null; avatar_url: string | null } | null;
}

function Comments(props: CommentsProps) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  useEffect(() => {
    const getStoryComments = async () => {
      const { data, error } = await supabase
        .from("story_comments")
        .select("*,profiles(username,avatar_url)")
        .eq("story_id", props.story_id)
        .order("created_at", { ascending: false });
      setComments(data);
    };
    getStoryComments();
  }, []);

  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const { theme, updateTheme } = useTheme();
  const styles = StyleSheet.create({
    avatarBox: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      borderRadius: 10,
      flex: 1,
    },
    textBox: {
      flex: 1,
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "flex-start",
      borderRadius: 10,
      marginLeft: 10,
      backgroundColor: theme.colors?.white,
      borderColor: theme.colors?.grey2,
      borderStyle: "solid",
      borderWidth: 1,
      padding: 5,
      overflow: "visible",
    },
    text: {
      flex: 1,
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "flex-start",
      fontSize: 16,
    },
    avatarTextBox: {
      boxSixing: "border-box",
      flex: 1,
      flexDirection: "row",
      alignContent: "flex-start",
      justifyContent: "flex-start",
      minWidth: "50%",
      width: "100%",
      maxWidth: 540,
      height: "auto",
      maxheight: "100%",
      marginTop: 10,
      marginLeft: 10,
      marginBottom: 10,
      margin: 0,
      borderRadius: 10,
      padding: 0,
    },
    background: {
      backgroundColor: "rgba(150,150,150,0.4)",
    },
    deleteCommentContainer: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-end",
      borderRadius: 20,
      marginTop: 5,
      margin: 10,
    },
  });

  return (
    <View style={styles.background}>
      <FlatList
        data={comments}
        renderItem={({ item: comment }) => (
          <View style={styles.avatarTextBox}>
            <Avatar
              onPress={() =>
                navigation.navigate("UserProfile", {
                  user_id: comment.profile_id,
                })
              }
              rounded
              source={{
                uri: comment.profiles?.avatar_url
                  ? comment.profiles?.avatar_url
                  : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
              }}
            />
            <View style={styles.textBox}>
              <Text>{`${comment.profiles?.username}  ${timeAgo(
                comment.created_at
              )}`}</Text>
              <Text style={styles.text}>{comment.content}</Text>
              <View style={styles.deleteCommentContainer}>
                <DeleteComment
                  story_id={props.story_id}
                  profile_id={comment.profile_id}
                  comment_id={comment.id}
                  comments={comments}
                  setComments={setComments}
                />
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <AddComment
              story_id={props.story_id}
              comments={comments}
              setComments={setComments}
            />
          </>
        }
      />
    </View>
  );
}

export default Comments;
