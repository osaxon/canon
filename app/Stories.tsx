import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Text } from "react-native-elements";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
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
      let { data, error } = await supabase.from("story_items").select("*");
      setStories(data);
    };
    getStories();
  }, []);

  if (!stories) return null;
  return (
    <>
    <TouchableOpacity onPress={() => navigation.navigate('StoryAdd', {story_id: stories[0].story_id!})}>
      <View style={styles.container}>
        <Text>{JSON.stringify(stories)}</Text>
        <Image style={styles.stretch} source={{ uri: stories[0].image_url! }} />
      </View>
      </TouchableOpacity>
    </>
  );
}

export default Stories;
