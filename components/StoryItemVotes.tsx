import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, useTheme } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import Error from "./Error";

interface StoryItemVotesProps {
    story_item_votes: number | null;
    story_item_id: number;
}

export default function StoryItemVotes({
    story_item_id,
    story_item_votes,
}: StoryItemVotesProps) {
    const [votes, setVotes] = useState<number | null>(null);
    const [upVoted, setUpVoted] = useState(false);
    const [downVoted, setDownVoted] = useState(false);
    const { theme, updateTheme } = useTheme();
    const [sessionError, setSessionError] = useState(false);
    const [session, setSession] = useState<Session | null>(null);

    const styles = StyleSheet.create({
        text: {
            textAlign: "center",
        },

        votesBox: {
            display: "flex",
            flexDirection: "row",
            maxWidth: 90,
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 20,
            backgroundColor: theme.colors?.grey5,
        },
        error: {
            display: "flex",
            flexDirection: "row",
            maxWidth: 150,
            marginLeft: 20,
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 20,
        },

        upVoteOn: {
            borderRadius: 20,
            backgroundColor: theme.colors?.success,
        },
        downVoteOn: {
            borderRadius: 20,
            backgroundColor: theme.colors?.error,
        },
        upVoteOff: {
            borderRadius: 20,
        },
        downVoteOff: {
            borderRadius: 20,
        },
    });

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
                .from("story_items")
                .update({ votes: votes! + inc })
                .eq("id", story_item_id)
                .select();
            setVotes(data![0].votes);
        } else {
            const { data, error } = await supabase
                .from("story_items")
                .update({ votes: story_item_votes! + inc })
                .eq("id", story_item_id)
                .select();
            setVotes(data![0].votes);
        }
    }
};

    return (
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
                <Text style={styles.text}>
                    {votes || votes === 0 ? votes : story_item_votes}
                </Text>
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
            <View style={styles.error}>{!sessionError ? null : <Error message="Please sign-in" />}</View>
        </View>
    );
}
