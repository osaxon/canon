import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";


const styles = StyleSheet.create({
    
    text: {
      margin: 0,
      marginLeft:5,
      padding: 0,
      textAlign: "center",
      maxWidth: "100%",
      marginRight: 5
    },
    
    votesBox: {
        display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "2%",
      marginLeft: "38%",
      marginRight: "38%",
      borderRadius: 20,
      backgroundColor: "lightgrey",
      padding: 0
    },

    upVoteOn: {
      borderRadius: 20,
      marginLeft: 0,
      marginRight: 5,
      backgroundColor: "lightgreen",
    },
    downVoteOn: {
      borderRadius: 20,
      marginLeft: 5,
      marginRight: 0,
      backgroundColor: "lightcoral",
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
      
    }
    
  });

interface StoryItemVotesProps {
  story_item_votes: number | null
  story_item_id: number;
//   setStoryVotes: any
}

export default function StoryItemVotes({ story_item_id, story_item_votes }: StoryItemVotesProps) {
    const [votes, setVotes] = useState<number | null>(story_item_votes);
    const [upVoted, setUpVoted] = useState(false)
    const [downVoted, setDownVoted] = useState(false)
  const vote = async (direction: string, inc: number) => {
    if(direction === "up"){
        setUpVoted(!upVoted && !downVoted)
        setDownVoted(false)
    } else {
        
        setUpVoted(false)
        setDownVoted(!upVoted && !downVoted)
    }
    const { data, error } = await supabase
      .from("story_items")
      .update({ votes: votes! + inc })
      .eq("id", story_item_id)
      .select();
      setVotes(data![0].votes)
  };

  return (
    <View style={styles.votesBox}>
      <Button icon={<Icon name="thumb-up-alt" size={20} />} style={upVoted ? styles.upVoteOn : styles.upVoteOff} type = {"clear"} onPress={() => {
        if(upVoted){
            vote("up", -1)
        } else {
            vote("up",1)
        }
      }} />
      <View>
      <Text style= {styles.text}>{votes}</Text>
      </View>
      <Button  icon={<Icon name="thumb-down-alt" size={20}  />} style={downVoted ? styles.downVoteOn : styles.downVoteOff} type = {"clear"} onPress={() => {
        if(downVoted){
            vote("down",1)
        } else {
            vote("down",-1)
        }
      }}/>
    </View>
  );
}