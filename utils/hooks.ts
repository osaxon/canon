import { supabase } from "../lib/supabase";
import { Tables } from "../types/database";
import { StoreImageProps } from "../types/functions";
import { storeImage } from "./supabase";
import { useQuery, useMutation } from "@tanstack/react-query";

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

/**
 * Uploads an image to storage and saves to a story item in the db
 *
 * @param {string} base64 the image to be stored - base64 format
 * @param {string} fileName the name of the file
 * @param {string} filePath the path to store the file
 * @param {string} storyItemId the id of the story item the image is related to
 * @returns the story item
 */
export const useStoreImageForStory = ({
    base64,
    fileName,
    filePath,
    storyItemId,
}: StoreImageProps & { storyItemId: string }) => {
    return useMutation({
        mutationKey: ["store-image", fileName, filePath],
        mutationFn: async () => {
            // 1. store the image to the storage bucket
            const img = await storeImage({ base64, fileName, filePath });

            // 2. update the story_item in the db
            const { data } = await supabase
                .from("story_items")
                .update({ image_url: img.path })
                .eq("id", storyItemId)
                .select("*")
                .throwOnError();

            return data || [];
        },
    });
};
