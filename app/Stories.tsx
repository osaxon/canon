import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import StoryCard from "../components/StoryCard";
import { supabase } from "../lib/supabase";
import { Database, Tables } from "../types/database";

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

    useFocusEffect(() => {
        const getStories = async () => {
            const { data, error } = await supabase
                .from("story_items")
                .select("*, profiles(username,avatar_url), stories(comment_count,votes)");
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
                    storyItems.push(story);
                }
            }
            setStories(() => {
                return storyItems.reverse();
            });
        };
        getStories();
    });

    useEffect(() => {
        console.log(stories, "<--- stories");
    }, [stories]);

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
