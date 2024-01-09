import { Text, Button, Icon } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";

interface DeleteCommentProps {
  profile_id: string | null;
  comment_id: number;
  setComments: any;
}

const styles = StyleSheet.create({
  submitButton: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
    margin: 5,
  },
});
export default function DeleteComment({ profile_id, comment_id, setComments }: DeleteCommentProps) {
  const [session, setSession] = useState<Session | null>(null);
  const onSubmit = async () => {
    try {
      const { data, error } = await supabase.from("story_comments").delete().eq("id", comment_id).select();
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
      <Button
        style={styles.submitButton}
        type="solid"
        onPress={onSubmit}
        icon={<Icon name="delete" size={20} color="white" />}
      >
        <Icon name="Save" />
      </Button>
    );
  }
}
