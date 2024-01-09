import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AddToStory from "../components/AddToStory";
import Comments from "../components/Comments";
import StoryItemCard from "../components/StoryItemCard";
import { Tables } from "../types/database";
import React from "react";
import Collapsible from "../components/Collapsible";
import Votes from "../components/Votes";
import { StoriesStackParams } from "../screens/StoriesScreens";

type Props = NativeStackScreenProps<StoriesStackParams, "FullStory">;
interface Story extends Tables<"story_items"> {
  profiles: { username: string | null; avatar_url: string | null } | null;
  stories: { comment_count: number | null; votes: number | null } | null;
}

const FullStory: React.FC<Props> = ({ route, navigation }) => {
  const { story_id, storyVotes, setStoryVotes } = route.params;
  const [story, setStory] = useState<Story[] | null>(null);

  useEffect(() => {
    const getStory = async () => {
      const { data, error } = await supabase
        .from("story_items")
        .select(
          "*, profiles(username,avatar_url), stories(comment_count, votes)"
        )
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
            <StoryItemCard storyItemData={storyItem as any} />
          )}
          // ListFooterComponent={
          //   <>
          //     <Collapsible title="comments">
          //       <Comments story_id={story_id} />
          //     </Collapsible>
          //     <Votes story_id={story_id} storyVotes = {storyVotes} setStoryVotes = {setStoryVotes} />
          //   </>
          //   }
          ListFooterComponent={
            <>
              <AddToStory />
              <Collapsible title="Comments" icon="chat">
                <Comments story_id={story_id} />
              </Collapsible>
              <Votes
                story_id={story_id}
                storyVotes={storyVotes}
                setStoryVotes={setStoryVotes}
              />
            </>
          }
        />
      ) : null}
    </>
  );
};

export default FullStory;
