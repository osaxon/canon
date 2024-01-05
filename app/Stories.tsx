import { useEffect, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Database } from "../database.types";
import { supabase } from "../lib/supabase";
import StoryCard from "../components/StoryCard";


const styles = StyleSheet.create({
  container: {
    overflow:"scroll",
    fontSize:"1em",
    boxSizing:"border-box",
    padding:1,
  },
});

export default function Stories() {
    const [stories, setStories] = useState<
        Database["public"]["Tables"]["story_items"]["Row"][] | null
    >(null);

    useEffect(() => {
        const getStories = async () => {
            const { data, error } = await supabase
                .from("story_items")
                .select("*");
            data?.sort((a, b) => {
                return a.id - b.id;
            });
            const storyItems: Database["public"]["Tables"]["story_items"]["Row"][] =
                [];
            const n = data?.length || 0;
            for (let i = 1; i <= n; i++) {
                const story: any = data?.find((element) => {
                    return element.story_id === i;
                });
                if (story) {
                    storyItems.push(story);
                }
            }
            setStories(storyItems);
        };
        getStories();
    }, []);
    return (
      <ScrollView style={styles.container}>
          {stories ? <FlatList
            data={stories}
            renderItem={({ item : story}) => (
              <StoryCard storyData={story as any} />
            )}
          /> : null}
      </ScrollView>
    );
}

