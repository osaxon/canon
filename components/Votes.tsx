import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button, Icon } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useTheme } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import Error from "./Error";

interface votesProps {
  storyVotes: number | null;
  story_id: number;
}

export default function Votes({ story_id, storyVotes }: votesProps) {
  const { theme, updateTheme } = useTheme();

  const styles = StyleSheet.create({
    text: {
      margin: 0,
      marginLeft: 5,
      padding: 0,
      textAlign: "center",
      maxWidth: "100%",
      marginRight: 5,
    },

    votesBox: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      backgroundColor: theme.colors?.grey2,
      padding: 0,
    },

    upVoteOn: {
      borderRadius: 20,
      marginLeft: 0,
      marginRight: 5,
      backgroundColor: theme.colors?.success,
    },
    downVoteOn: {
      borderRadius: 20,
      marginLeft: 5,
      marginRight: 0,
      backgroundColor: theme.colors?.error,
    },
    upVoteOff: {
      borderRadius: 20,
      marginLeft: 0,
      marginRight: 5,
    },
    downVoteOff: {
      borderRadius: 20,
      marginLeft: 5,
      marginRight: 0,
    },
  });
  const [votes, setVotes] = useState<number | null>(storyVotes);
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const vote = async (direction: string, inc: number) => {
    if (!session) {
      setSessionError(true);
      setTimeout(() => {
        setSessionError(false);
      }, 3000);
    } else {
      if (direction === "up") {
        setUpVoted(!upVoted && !downVoted);
        setDownVoted(false);
      } else {
        setUpVoted(false);
        setDownVoted(!upVoted && !downVoted);
      }
      if (votes) {
        const { data, error } = await supabase
          .from("stories")
          .update({ votes: votes! + inc })
          .eq("id", story_id)
          .select();
        setVotes(data![0].votes);
      } else {
        const { data, error } = await supabase
          .from("stories")
          .update({ votes: storyVotes! + inc })
          .eq("id", story_id)
          .select();
        setVotes(data![0].votes);
      }
    }
  };

  return (
    <>
      <View style={styles.votesBox}>
        <Button
          icon={<Icon name="thumb-up-alt" size={20} />}
          style={upVoted ? styles.upVoteOn : styles.upVoteOff}
          type={"clear"}
          onPress={() => {
            if (upVoted) {
              vote("up", -1);
            } else {
              vote("up", 1);
            }
          }}
        />
        <View>
          <Text style={styles.text}>{votes || votes === 0 ? votes : storyVotes}</Text>
        </View>
        <Button
          icon={<Icon name="thumb-down-alt" size={20} />}
          style={downVoted ? styles.downVoteOn : styles.downVoteOff}
          type={"clear"}
          onPress={() => {
            if (downVoted) {
              vote("down", 1);
            } else {
              vote("down", -1);
            }
          }}
        />
      </View>
      <View>{!sessionError ? null : <Error message="Please sign-in" />}</View>
    </>
  );
}
