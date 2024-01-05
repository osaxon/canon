import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { StackParams } from "../App";
import { Database } from "../types/database";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AddToStory from "../components/AddToStory";
import Comments from "../components/Comments";

type Props = NativeStackScreenProps<StackParams, "FullStory">;
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  stretch: {
    width: 400,
    height: 200,
    alignSelf: "center",
  },
});

const FullStory: React.FC<Props> = ({ route, navigation }) => {
  const { story_id } = route.params;
  const [story, setStory] = useState<
    Database["public"]["Tables"]["story_items"]["Row"][] | null
  >(null);

  useEffect(() => {
    const getStory = async () => {
      const { data, error } = await supabase
        .from("story_items")
        .select("*")
        .eq("story_id", story_id);
      setStory(data);
    };
    getStory();
  }, []);
  return (
    <>
      {/* <Text>{JSON.stringify(story)}</Text> */}
      <FlatList
        data={story}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text>{item.prompt!}</Text>
            <Image style={styles.stretch} source={{ uri: item.image_url! }} />
            <Text>Votes: {item.votes!}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("StoryComments", { story_id })}
      >
        <Text>See comments</Text>
      </TouchableOpacity>
      <Comments story_id={story_id} />
      <AddToStory />
    </>
  );
};

export default FullStory;
