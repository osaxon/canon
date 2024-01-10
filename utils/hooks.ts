import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/core";
import { ImageContext } from "../types/functions";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";
import { NewStoryInputs } from "../types/functions";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useContext, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import { useFocusEffect } from "@react-navigation/native";
import { Tables } from "../types/supabase";

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}

export const useGetStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stories")
        .select("*,profiles(username,avatar_url)")
        .order("created_at", { ascending: false })
        .throwOnError();
      return data || [];
    },
  });
};

const storiesQuery = supabase
  .from("stories")
  .select("*,profiles(username,avatar_url)")
  .order("created_at", { ascending: false });

export type StoriesWithProfileData = QueryData<typeof storiesQuery>;

const fetchStories = async ({ pageParam }: { pageParam: number }) => {
  console.log(pageParam, "<--- the page param");
  const { data } = await supabase
    .from("stories")
    .select("*,profiles(username,avatar_url)")
    .order("created_at", { ascending: false })
    .range(pageParam * 4, pageParam + 1 * 2 - 1)
    .limit(3)
    .throwOnError();
  // console.log(JSON.stringify(data, null, 2), "<--- the returned data");
  return (data as StoriesWithProfileData) || [];
};

export const useHomeFeed = () => {
  return useInfiniteQuery({
    queryKey: ["home-feed"],
    queryFn: fetchStories,
    initialPageParam: 0,
    getNextPageParam: (
      lastPage,
      allPages,
      lastPageParam
    ): number | undefined => {
      // console.log(lastPage.length, "<--- last page length");
      // console.log(lastPageParam, "<--- last page param");
      if (lastPage.length === 0) {
        return undefined;
      }
      // console.log(lastPageParam + 1, "<--- next page param");
      return lastPageParam + 1;
    },
  });
};

/**
 * Fetches all story items that match the given storyId
 *
 * @param {string} storyId the id of the story
 * @returns the story items and related data for story and profiles
 */
export const useFullStory = (storyId: number) => {
  return useQuery({
    queryKey: ["story", storyId],
    queryFn: async () => {
      const [storyItemsResponse, storyResponse] = await Promise.all([
        supabase
          .from("story_items")
          .select("*, profiles(username, avatar_url)")
          .eq("story_id", storyId)
          .order("id")
          .throwOnError(),
        supabase.from("stories").select("*").eq("id", storyId),
      ]);

      const storyItems = storyItemsResponse.data;
      const story = storyResponse.data;

      if (!storyItems || !story) throw new Error("no story found");
      const fullStory = {
        ...story[0],
        storyItems,
      };
      return fullStory;
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
      // console.log("saving story");
      // 1. create the story record
      const { data: story } = await supabase
        .from("stories")
        .insert({
          image_context: imageData.imageContext,
          created_by: userId,
          first_image_url: imageData.imageUrl!,
        })
        .select("*")
        .throwOnError();

      // console.log(story, "<--- the new story");

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

      // console.log(storyItem, "<--- the new story item");

      return { story, storyItem } || [];
    },
    onSuccess: () => navigation?.navigate("StoriesStack", {screen: "Stories"}),
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

export const getLogo = async () => {
  try {
    const { data } = await supabase.storage
      .from("avatars")
      .getPublicUrl("logo/canon.png");

    return data?.publicUrl;
  } catch (error) {
    console.error(error);
  }
};
