import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList,} from "react-native";
import StoryCard from "../components/StoryCard";
import { supabase } from "../lib/supabase";
import { Database, Tables } from "../types/database";

export default function Stories() {
    const [stories, setStories] = useState<
        Database["public"]["Tables"]["story_items"]["Row"][] | null
    >(null);

    useFocusEffect(() => {
        const getStories = async () => {
            const { data, error } = await supabase
                .from("story_items")
                .select("*, profiles(username,avatar_url), stories(comment_count,votes, story_comments(count))");
            data?.sort((a, b) => {
                return a.id - b.id;
            });
            const storyItems: Tables<"story_items">[] = [];
            const allStoryIds =
                [...new Set(data?.map((row) => row.story_id))] || [];
            for (let i of allStoryIds) {
                const story: any = data?.find((element) => {
                    return element.story_id === i;
                });
                if (story) {
                  story.comment_count = story.stories.story_comments[0].count
                    storyItems.push(story);
                }
            }
            setStories(() => {
                return storyItems.reverse();
            });
        };
        getStories();
    });

    return (
        <>
            {stories ? (
                <FlatList
                    data={stories}
                    renderItem={({ item: story }) => {
                        return <StoryCard storyData={story as any} />;
                    }}
                />
            ) : null}
        </>
    );
}
