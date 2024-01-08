import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Tables } from "../types/database";
import { supabase } from "../lib/supabase";
import { Text } from "react-native";
import { timeAgo } from "../utils/timeFunctions";
import React from "react";

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

  return (
    <FlatList
      data={comments}
      renderItem={({ item: comment }) => (
        <ListItem bottomDivider>
          <Avatar
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
  );
}

export default Comments;
