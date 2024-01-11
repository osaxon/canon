import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Input } from "react-native-elements";
import React from "react";
import Error from "./Error";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Tables } from "../types/database";
import { Dispatch, SetStateAction } from "react";
import { useTheme } from "@rneui/themed";
import { Comment } from "./Comments";
import { useFocusEffect } from '@react-navigation/native'

// interface Comment extends Tables<"story_comments"> {
//   profiles: { username: string | null; avatar_url: string | null } | null;
// }

interface CommentsProps {
  story_id: number;
  comments: Comment [] | null
  setComments: Dispatch<SetStateAction<Comment[] | null>>;
}

export default function AddComment({ story_id, comments, setComments }: CommentsProps) {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const onSubmit = async () => {
    if (input.length === 0) {
      setInputError(true);
      setTimeout(() => {
        setInputError(false);
      }, 3000);
    } else if (!session) {
      setSessionError(true);
      setTimeout(() => {
        setSessionError(false);
      }, 3000);
    } else {
      setInputError(false);
      setSessionError(false);
      try {
        const { data, error } = await supabase
          .from("story_comments")
          .insert({
            content: input,
            story_id: story_id,
            profile_id: session.user.id,
          })
          .select("*,profiles(username,avatar_url)");
         await supabase
        .from("stories")
        .update({ comment_count: comments!.length + 1 })
        .eq("id", story_id)
        .select();
        setComments((currComments) => {
          const newComments = [];
          if (data !== null) {
            newComments.push(data[0]);
          }
          currComments?.forEach((comment) => {
            newComments.push(comment);
          });
          return newComments;
        });
        setInput("");
      } catch {
        setRequestFailed(true);
        setTimeout(() => {
          setRequestFailed(false);
        }, 3000);
      }
    }
  };
  const { theme, updateTheme } = useTheme()
  const styles = StyleSheet.create({
    avatarBox: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      borderRadius: 10,
    },
    text: {
      fontSize: "1em" as any,
    },
    addCommentBox: {
      boxSixing: "border-box",
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      height: "auto",
      maxheight: "100%",
      marginTop:20,
      margin: 0,
      marginLeft: 5,
      width: "100%",
      maxWidth: "82%",
      borderRadius: 10,
    },
    inputBox: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-end",
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: "white",
      borderColor: "silver",
      borderStyle: "solid",
      borderWidth:1,
      padding: 5,
    },
    submitButtonContainer: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-end",
      borderRadius: 20,
      marginTop: 5,
      margin: 10,
    },
    InputSubmitBox: {
      backgroundColor: theme.colors?.grey4,
      boxSixing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "flex-start",
      minWidth: "50%",
      width: "100%",
      maxWidth: 500,
      height: "auto",
      maxheight: "100%",
      marginBottom: 20,
      marginLeft:10,
      margin: "auto",
      borderRadius: 10,
      padding: 0,
    },
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useFocusEffect(() => {
    async function fetchAvatarUrl() {
      if (!session?.user.id) {
        return;
      }

      if (session?.user.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url, username")
          .eq("id", session?.user.id)
          .single();

        if (error) {
          console.error("Error fetching avatar URL:", error);
        } else if (data && data.avatar_url) {
         setUsername(data.username)
          setAvatarUrl(data.avatar_url);
        }
      }
    }
    fetchAvatarUrl();
  });


  return (
    <View style={styles.addCommentBox}>
      <Avatar
        size={"medium"}
        rounded
        containerStyle={{
          borderColor: "slategrey",
          borderStyle: "solid",
          borderWidth: 2,
          marginTop:5,
          marginLeft:5,
          backgroundColor:"white",
        }}
        source={{
          uri: avatarUrl
            ? avatarUrl
            : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
        }}
      />
      <View style={styles.InputSubmitBox}>
        <Input
          style={styles.inputBox}
          value={input}
          onChangeText={setInput}
          placeholder="add comment..."
          multiline
        />
        {!inputError ? null : <Error message="Please add text" />}
        {!sessionError ? null : <Error message="Please sign-in" />}
        {!requestFailed ? null : <Error message="Sorry request failed" />}
        <View style={styles.submitButtonContainer}>
        <Button title={`Submit` } onPress={onSubmit} />
        </View>
      </View>
    </View>
  );
}
