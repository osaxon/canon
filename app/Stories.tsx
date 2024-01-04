import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Text } from "react-native-elements";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Database } from "../database.types";
import {useNavigation} from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParams } from '../App';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  stretch: {
    width: 50,
    height: 200,
  },
});

function Stories() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>()
  const [stories, setStories] = useState<
    Database["public"]["Tables"]["story_items"]["Row"][] | null
  >(null);

  useEffect(() => {
    const getStories = async () => {
      const { data, error } = await supabase.from("story_items").select("*");
      data?.sort((a,b) => {
        return a.id - b.id
      })
      const storyItems: Database["public"]["Tables"]["story_items"]["Row"][] = []
      const n = data?.length || 0
      for (let i = 1; i <= n; i++) {
        const story: any = data?.find((element) => {
          return element.story_id === i
        })
        if(story){
          storyItems.push(story)
        }

      }
      setStories(storyItems);
    };
    getStories();
  }, []);

  if (!stories) return null;
  return (
    <>
      <View style={styles.container}>
        <Text>{JSON.stringify(stories)}</Text>
        
        <FlatList data = {stories} renderItem={({item}) => 
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('StoryAdd', {story_id: item.story_id!})}>
        <Image style={styles.stretch} source={{ uri: item.image_url! }} />
        </TouchableOpacity>
        </View>}/>
      </View>
    </>
  );
}

export default Stories;
