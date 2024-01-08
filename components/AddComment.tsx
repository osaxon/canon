import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Input } from "react-native-elements";
import React from "react";
import Error from "./Error";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Tables } from "../types/database";
import { Dispatch, SetStateAction } from "react";

interface Comment extends Tables<"story_comments"> {
  profiles: { username: string | null; avatar_url: string | null } | null;
}

interface CommentsProps {
  story_id: number;
  setComments: Dispatch<SetStateAction<Comment[] | null>>;
}

export default function AddComment({ story_id, setComments }: CommentsProps) {
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
          .insert({ content: input, story_id: story_id, profile_id: session.user.id })
          .select("*,profiles(username,avatar_url)");
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

  return (
    <View>
      <Input value={input} onChangeText={setInput} placeholder="add comment..." />
      {!inputError ? null : <Error message="Please add text" />}
      {!sessionError ? null : <Error message="Please sign-in" />}
      {!requestFailed ? null : <Error message="Sorry request failed" />}
      <Button title="Submit" onPress={onSubmit} />
    </View>
  );
}
