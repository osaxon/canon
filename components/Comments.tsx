import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Tables } from "../types/database";
import { supabase } from "../lib/supabase";
import { Text } from "react-native";
import { timeAgo } from "../utils/timeFunctions";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import React from "react"
import AddComment from "../components/AddComment";

const defaultUser = require("../assets/user.png");

type CommentsProps = {
  story_id: number;
};

interface Comment extends Tables<"story_comments"> {
  profiles: { username: string | null; avatar_url: string | null } | null;
}

function Comments(props: CommentsProps) {
  const [comments, setComments] = useState<Comment[] | null >(null);
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

  console.log(comments)

  return (
    <View>
    <FlatList
      data={comments}
      renderItem={({ item: comment }) => (
        <ListItem bottomDivider>
          <Avatar
          onPress={() => navigation.navigate("UserProfile", {user_id: comment.profile_id})}
            rounded
            source={{
              uri: comment.profiles?.avatar_url
                ? comment.profiles?.avatar_url
                : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
          <ListItem.Content>
            {/* <ListItem.Title>John Doe</ListItem.Title> */}
            <Text>{`${comment.profiles?.username}  ${timeAgo(
              comment.created_at
            )}`}</Text>
            <ListItem.Title>{comment.content}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )}
    />
    <AddComment story_id={props.story_id} setComments = {setComments} />
    </View>
  );
}

export default Comments;
