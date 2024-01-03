import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Text } from "react-native-elements";
import { Image, StyleSheet, View } from "react-native";
import { Database } from "../database.types";

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
      <View style={styles.container}>
        <Text>{JSON.stringify(stories[0]["prompt"])}</Text>
        <Image style={styles.stretch} source={{ uri: stories[0].image_url! }} />
      </View>
    </>
  );
}

export default Stories;
