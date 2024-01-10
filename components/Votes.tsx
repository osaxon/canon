import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button, Icon } from "react-native-elements";
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

interface votesProps {
  storyVotes: number | null;
  story_id: number;
}

export default function Votes({ story_id, storyVotes }: votesProps) {
    const [votes, setVotes] = useState<number | null>(storyVotes);
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
    if(votes){
    const { data, error } = await supabase
      .from("stories")
      .update({ votes: votes! + inc })
      .eq("id", story_id)
      .select();
      setVotes(data![0].votes)
    } else {
      const { data, error } = await supabase
        .from("stories")
        .update({ votes: storyVotes! + inc })
        .eq("id", story_id)
        .select();
        setVotes(data![0].votes)
      }
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
      <Text style= {styles.text}>{votes || votes === 0 ? votes : storyVotes}</Text>
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
