import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar } from "react-native-elements";
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

const styles = StyleSheet.create({
  avatarBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  textBox: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    marginLeft:10,
    backgroundColor: "white",
    border: "solid 1px silver",
    padding: 5,
  },
  text: {
    fontSize:16
  },
  avatarTextBox: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    minWidth: "50%",
    width: "100%",
    maxWidth: 500,
    height: "auto",
    maxheight: "100%",
    marginLeft:10,
    marginBottom: 10,
    margin:0,
    borderRadius: 10,
    padding: 0,
  },
});

type CommentsProps = {
  story_id: number;
};

interface Comment extends Tables<"story_comments"> {
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

  return (
    <View>
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
              <DeleteComment profile_id = {comment.profile_id} comment_id = {comment.id} setComments={setComments}/>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <AddComment story_id={props.story_id} setComments={setComments} />
          </>
        }
      />
    </View>
  );
}

export default Comments;
