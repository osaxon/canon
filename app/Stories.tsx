import React from "react";
import { FlatList, View } from "react-native";
import { Button } from "react-native-elements";
import StoryCard from "../components/StoryCard";
import { useHomeFeed, useRefreshOnFocus } from "../utils/hooks";

export default function Stories() {
  const {
    data: stories,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    status,
    error,
  } = useHomeFeed();
  useRefreshOnFocus(refetch);

  if (status === "error") console.error(error);

  const flattenData = stories?.pages
    ? stories?.pages?.flatMap((storyPage) => [...storyPage])
    : [];

  return (
    <>
      <View style={{ flex: 1 }}>
        {stories ? (
          <FlatList
            data={flattenData}
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
                  type="outline"
                  title="Load More"
                />
              </>
            }
          />
        ) : null}
      </View>
    </>
  );
}
