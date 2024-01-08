import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList,StyleSheet} from "react-native";
import { StackParams } from "../App";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AddToStory from "../components/AddToStory";
import Comments from "../components/Comments";
import StoryItemCard from "../components/StoryItemCard";
import { Tables } from "../types/database";
import React from "react";
import Collapsible from "../components/Collapsible";
import Votes from "../components/Votes";


type Props = NativeStackScreenProps<StackParams, "FullStory">;
interface Story extends Tables<"story_items"> {
  profiles: { username: string | null; avatar_url: string | null } | null;
  stories: { comment_count: number | null; votes: number | null } | null;

}

const FullStory: React.FC<Props> = ({ route, navigation }) => {
  // const [isCollapsed, setIsCollapsed] = useState(false)
  const { story_id } = route.params;
  const [story, setStory] = useState<Story[] | null>(null);

  useEffect(() => {
    const getStory = async () => {
      const { data, error } = await supabase
        .from("story_items")
        .select("*, profiles(username,avatar_url), stories(comment_count, votes)")
        .eq("story_id", story_id);
      setStory(data);
    };
    getStory();
  }, []);
  return (
    <>
        {story ? (
          <FlatList
            data={story}
            renderItem={({ item: storyItem }) => (
              <StoryItemCard storyItemData={storyItem as any} 
              />
            )}
            ListHeaderComponent={<>
              <Votes story_id={story_id} />
            </>
            }
            ListFooterComponent={<>
              <AddToStory />
              <Collapsible title='Comments' icon="chat">
              <Comments story_id={story_id} />
              </Collapsible>
            </>
            }
          />
        ) : null}
    </>
  );
};

export default FullStory;
