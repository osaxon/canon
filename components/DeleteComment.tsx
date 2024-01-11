import { Text, Icon } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
import { Comment } from "./Comments";
import { useTheme, Button, } from "@rneui/themed";

interface DeleteCommentProps {
  story_id: number;
  profile_id: string | null;
  comment_id: number;
  comments: Comment[] | null;
  setComments: any;
}

export default function DeleteComment({ story_id, profile_id, comment_id, comments, setComments }: DeleteCommentProps) {
  const [session, setSession] = useState<Session | null>(null);
  const { theme, updateTheme } = useTheme()
  const styles = StyleSheet.create({
    submitButton: {
      margin: 5,
    },
  });
  const onSubmit = async () => {
    try {
      const { data, error } = await supabase
      .from("story_comments")
      .delete()
      .eq("id", comment_id)
      .select();
      await supabase
        .from("stories")
        .update({ comment_count: comments!.length - 1 })
        .eq("id", story_id)
        .select();
      setComments((currComments: Comment[]) => {
        const index = currComments.findIndex((comment: any) => {
          return comment.id === comment_id;
        });
        let newComments: Comment[] = [];
        currComments.forEach((comment: Comment) => {
          newComments.push(comment);
        });
        newComments.splice(index, 1);
        console.log(newComments);
        return newComments;
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  if (profile_id === session?.user.id) {
    return (
      <>
      <Button
        color={"error"}
        type="solid"
        onPress={onSubmit}
        icon={<Icon name="delete" size={20} color="white" />}
      />
      </>
    );
  }
}
