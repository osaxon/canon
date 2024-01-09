import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/core";
import { ImageContext } from "../types/functions";
import { NewStoryInputs } from "../types/functions";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";

export const useGetStories = () => {
    return useQuery({
        queryKey: ["stories"],
        queryFn: async () => {
            const { data } = await supabase
                .from("stories")
                .select("*")
                .throwOnError();
            return data || [];
        },
    });
};

export const useGetComments = () => {
    return useQuery({
        queryKey: ["comments"],
        queryFn: async () => {
            const { data } = await supabase
                .from("comments")
                .select("*")
                .throwOnError();
            return data || [];
        },
    });
};

/**
 * Gets comments for a single story
 *
 * @param {string} storyId the id of the story
 * @returns array of comments
 */
export const useGetStoryComments = (storyId: string) => {
    return useQuery({
        queryKey: ["story_comments", storyId],
        queryFn: async () => {
            const { data } = await supabase
                .from("comments")
                .select("*")
                .eq("story_item_id", storyId)
                .throwOnError();
            return data || [];
        },
    });
};

export const useNewStory = ({ imageData, userId }: NewStoryInputs) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    return useMutation({
        mutationKey: ["new-story", userId, imageData.imageUrl],
        mutationFn: async () => {
            console.log("saving story");
            // 1. create the story record
            const { data: story } = await supabase
                .from("stories")
                .insert({
                    image_context: imageData.imageContext,
                    created_by: userId,
                })
                .select("*")
                .throwOnError();

            console.log(story, "<--- the new story");

            if (!story) {
                console.error("failed to create the story");
                throw new Error("failed to create the story record");
            }

            if (!imageData.prompt || !imageData.imageUrl) {
                console.error("no image data found");
                throw new Error("no image data found");
            }

            console.log("saving story item");
            // 2. create the story item
            const { data: storyItem, error } = await supabase
                .from("story_items")
                .insert({
                    prompt: imageData.prompt,
                    image_url: imageData.imageUrl,
                    story_id: story[0].id,
                    profile_id: userId,
                })
                .select()
                .throwOnError();

            if (!storyItem) {
                console.error("failed to create new story item");
                throw new Error("failed to create new story item");
            }

            console.log(storyItem, "<--- the new story item");

            return { story, storyItem } || [];
        },
        onSuccess: () => navigation?.navigate("Explore"),
        onError: (error) => console.error(error),
    });
};

export const useGetHomeFeed = () => {
    return useQuery({
        queryKey: ["story-items"],
        queryFn: async () => {
            const { data } = await supabase
                .from("story_items")
                .select(
                    "*, profiles(username,avatar_url), stories(votes, comment_count)"
                )
                .order("created_at", { ascending: false })
                .throwOnError();
        },
    });
};

// TODO add 'latest_img_url' to 'story' schema
// will make it easier to manage the main home feed content
// fetch all stories rather than story_items
// when new story_item is added to story, update story with new url
