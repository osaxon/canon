import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native-elements";
import { useUpvote } from "../utils/hooks";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

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
    <View>
      <Button title="⬆" onPress={() => {
        vote(1)
      }} />
      <Text>Votes: {votes}</Text>
      <Button title="⬇" onPress={() => {
        vote(-1)
      }}/>
    </View>
  );
}
