import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { Database } from "../types/database";
import { supabase } from "../lib/supabase";
import StoryCard from "../components/StoryCard";

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
    fontSize: "1em",
    boxSizing: "border-box",
    padding: 1,
  },
});

export default function Stories() {
  const [stories, setStories] = useState<
    Database["public"]["Tables"]["story_items"]["Row"][] | null
  >(null);
  const [profiles, setProfiles] = useState<
    Database["public"]["Tables"]["profiles"]["Row"][] | null
  >(null);

  const findStoryOps = async (story: any) => {
    console.log(profiles);
    const storyOps: any = profiles?.find((profile) => {
      return profile.id === story.profile_id;
    });
    return storyOps as any;
  };

  useEffect(() => {
    const getStories = async () => {
      const { data, error } = await supabase.from("story_items").select("*");
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
      setStories(() => {
        const storyItemsSorted = storyItems.sort((a, b) => {
          const timeA = Date.parse(a.created_at);
          const timeB = Date.parse(b.created_at);
          return timeB - timeA;
        });
        return storyItemsSorted;
      });
    };
    getStories();

    const getProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      const profilesNew: Database["public"]["Tables"]["profiles"]["Row"][] = [];
      data?.forEach((profile) => {
        profilesNew.push(profile);
      });

      setProfiles(profilesNew);
    };
    getProfiles();
  }, []);

  useEffect(() => {
    console.log(stories);
  }, [stories]);

  return (
    <ScrollView style={styles.container}>
      {stories ? (
        <FlatList
          data={stories}
          renderItem={({ item: story }) => {
            const opProfile = findStoryOps(story);
            return (
              <StoryCard
                storyData={story as any}
                opProfile={opProfile as any}
              />
            );
          }}
        />
      ) : null}
    </ScrollView>
  );
}
