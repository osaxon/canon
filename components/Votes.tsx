import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-elements";
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
    },
    
  });

interface votesProps {
  storyVotes: number | null
  story_id: number;
  setStoryVotes: any
}

export default function Votes({ story_id, storyVotes, setStoryVotes }: votesProps) {
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
    const { data, error } = await supabase
      .from("stories")
      .update({ votes: votes! + inc })
      .eq("id", story_id)
      .select();
      setVotes(data![0].votes)
    setStoryVotes(data![0].votes)
  };

  return (
    <View style={styles.votesBox}>
      <Button title="⬆" type = {upVoted? "solid": "clear"} onPress={() => {
        if(upVoted){
            vote("up", -1)
        } else {
            vote("up",1)
        }
      }} />
      <View>
      <Text style= {styles.text}>Votes: {votes}</Text>
      </View>
      <Button  title="⬇" type = {downVoted? "solid": "clear"} onPress={() => {
        if(downVoted){
            vote("down",1)
        } else {
            vote("down",-1)
        }
      }}/>
    </View>
  );
}
