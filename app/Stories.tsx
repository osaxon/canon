import React, { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Image } from "react-native-elements";
import StoryCard from "../components/StoryCard";
import { useHomeFeed, useRefreshOnFocus } from "../utils/hooks";
import { getLogo } from "../utils/hooks";
import { useFocusEffect } from "@react-navigation/native";
import ScreenBackground from "../components/ScreenBackground";


export default function Stories() {
  //   const { data: stories, refetch } = useGetStories();
  //   console.log(stories);
  const [logo, setLogo] = useState<string | undefined>(undefined);

  const {
    data: stories,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    status,
    error,
  } = useHomeFeed();
  useRefreshOnFocus(refetch);

  // console.log(JSON.stringify(stories?.pages, null, 2), "<--- the pages");
  if (status === "error") console.error(error);

  const flattenData = stories?.pages
    ? stories?.pages?.flatMap((storyPage) => [...storyPage])
    : [];

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchLogo = async () => {
        const url = await getLogo();
        if (isActive) setLogo(url);
      };

      if (!logo) {
        fetchLogo();
      }

      return () => {
        isActive = false;
      };
    }, [logo])
  );

  return (
    <ScreenBackground>
      <View style={{ flex: 1 }}>
        {stories ? (
          <FlatList
            data={flattenData}
            ListHeaderComponent={
              <Image
                source={{ uri: logo }}
                style={{
                  width: 100,
                  height: 70,
                  top: 1,
                  left: 1,
                }}
              />
            }
            renderItem={({ item: story }) => {
              return (
                <StoryCard
                  username={story.profiles?.username!}
                  avatar_url={story.profiles?.avatar_url!}
                  {...story}
                />
              );
            }}
            ListFooterComponent={
              <>
                <Button
                  loading={isFetchingNextPage}
                  onPress={() => fetchNextPage()}
                  title="Load More"
                />
              </>
            }
          />
        ) : null}
      </View>
    </ScreenBackground>
  );
}
