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
    },
    
    votesBox: {
        display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    
  });

interface votesProps {
  
  story_id: number;
}

export default function Votes({ story_id }: votesProps) {
    const [votes, setVotes] = useState<number>(0);
    useEffect(() => {
        const getVotes = async () => {
            try {const { data, error } = await supabase.from("stories").select("*").eq("id", story_id);
          if(data != null){
            setVotes(data[0].votes!)
          }
        }
     catch {
       
    };}
        getVotes();
      }, []);
  const vote = async (inc: number) => {
    setVotes(votes + inc)
    const { data, error } = await supabase
      .from("stories")
      .update({ votes: votes + inc })
      .eq("id", story_id)
      .select();
  };

  return (
    <View style={styles.votesBox}>
      <Button title="⬆" type = "clear" onPress={() => {
        vote(1)
      }} />
      <View>
      <Text style= {styles.text}>Votes: {votes}</Text>
      </View>
      <Button title="⬇" type = "clear" onPress={() => {
        vote(-1)
      }}/>
    </View>
  );
}
