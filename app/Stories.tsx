import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import StoryCard from "../components/StoryCard";
import { supabase } from "../lib/supabase";
import { Database, Tables } from "../types/database";
import { useGetStories, useRefreshOnFocus } from "../utils/hooks";
import { queryClient } from "../App";
import ScreenBackground from "../components/ScreenBackground";

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
    fontSize: "1em",
    boxSizing: "border-box",
    padding: 1,
  },
});

export default function Stories() {
  const { data: stories, refetch } = useGetStories();
  console.log(stories);

  useRefreshOnFocus(refetch);

  return (
    <ScreenBackground>
      {stories ? (
        <FlatList
          data={stories}
          renderItem={({ item: story }) => {
            return (
              <StoryCard
                username={story.profiles?.username!}
                avatar_url={story.profiles?.avatar_url!}
                {...story}
              />
            );
          }}
        />
      ) : null}
    </ScreenBackground>
  );
}
