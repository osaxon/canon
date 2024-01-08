import { supabase } from "../lib/supabase";
import { Tables } from "../types/database";
import {
    GenerateImageResponse,
    ImageContext,
    StoreImageProps,
} from "../types/functions";
import { storeImage } from "./supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useUpvote = (storyId: string, currVotes: number) => {
    return useMutation({
        mutationKey: ["upvote", storyId],
        mutationFn: async () => {
            await supabase.from("story_items").update({ votes: currVotes + 1 });
        },
    });
};

export const useNewStory = ({
    imageUrl,
    imageContext,
    userId,
}: {
    imageUrl: string;
    imageContext: ImageContext;
    userId: string;
}) => {
    return useMutation({
        mutationKey: ["new-story", userId, imageUrl],
        mutationFn: async () => {
            const { data } = await supabase.from("stories").insert({
                comment_count: 0,
                created_at: new Date().toDateString(),
                votes: 0,
            });
        },
    });
};
