import { supabase } from "../lib/supabase";
import { ImageContext } from "../types/functions";
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
